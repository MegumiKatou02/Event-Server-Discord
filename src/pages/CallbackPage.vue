<script lang="ts">
import { defineComponent } from 'vue';
import { getAccessToken, getUserInfo, getGuilds } from '@/services/discordApi';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

const GUILD_ID = import.meta.env.VITE_DISCORD_GUILD_ID;

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
}

export default defineComponent({
  name: 'CallBack',
  data() {
    return {
      user: null as User | null,
    };
  },
  async mounted() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    try {
      const tokenData = await getAccessToken(code);

      const guilds = await getGuilds(tokenData.access_token);

      const isInServer = guilds.some((guild) => guild.id === GUILD_ID);

      if (!isInServer) {
        throw new Error('Bạn cần tham gia server Discord của chúng tôi để đăng ký.');
      }

      const userInfo = await getUserInfo(tokenData.access_token);
      const avatarUrl = userInfo.avatar
        ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${userInfo.discriminator % 5}.png`;

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('id', '==', userInfo.id));
      const querySnapshot = await getDocs(q);

      const userData = {
        id: userInfo.id,
        username: userInfo.username,
        discriminator: userInfo.discriminator,
        avatarUrl: avatarUrl,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      if (!querySnapshot.empty) {
        const docRef = doc(db, 'users', querySnapshot.docs[0].id);
        await setDoc(docRef, userData, { merge: true });
      } else {
        await setDoc(doc(usersRef, userInfo.id), userData);
      }

      this.$router.push('/users');
    } catch (error) {
      console.error('Error during login:', error);
      this.$router.push({
        path: '/error',
        query: { message: 'Bạn phải tham gia server Discord của chúng tôi để đăng ký' }
      });
    }
  },
});
</script>
