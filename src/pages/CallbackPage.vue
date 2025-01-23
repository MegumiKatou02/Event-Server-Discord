<template>
  <div class="login-page">
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang xử lí...</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { getAccessToken, getUserInfo, getGuilds } from '@/services/discordApi';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

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
    if (!code) {
      this.$router.push({
        path: '/error',
        query: { message: 'Không tìm thấy mã xác thực' }
      });
      return;
    }

    try {
      const tokenData = await getAccessToken(code);

      const guilds = await getGuilds(tokenData.access_token);

      const isInServer = guilds.some((guild) => guild.id === GUILD_ID);

      if (!isInServer) {
        throw new Error('Bạn cần tham gia server Discord của chúng tôi để thực hiện thao tác này');
      }

      const userInfo = await getUserInfo(tokenData.access_token);

      const localStorageAction = localStorage.getItem('discordState');

      if (localStorageAction === 'unsubscribe') {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('id', '==', userInfo.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = doc(db, 'users', querySnapshot.docs[0].id);
          await deleteDoc(docRef);
          console.log('User đã được xóa thành công');
        } else {
          throw new Error('Chưa tham gia giveaway mà đòi huỷ :v');
        }

        localStorage.removeItem('oauth_action');

        this.$router.push({
          path: '/users',
          query: { message: 'Hủy đăng ký thành công' }
        });
        return;
      }

      const avatarUrl = userInfo.avatar
        ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${userInfo.discriminator % 5}.png`;

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('id', '==', userInfo.id));
      const querySnapshot = await getDocs(q);

      const userData = {
        id: userInfo.id,
        globalname: userInfo.global_name,
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

      this.$router.push('/users');this.$router.push({
        path: '/users',
        query: { message: 'Đăng ký thành công' }
      })
    } catch (error) {
      console.error('Error during login:', error);
      this.$router.push({
        path: '/error',
        query: { message: (error as Error).message}
      });
    }
  },
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #1db954;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
