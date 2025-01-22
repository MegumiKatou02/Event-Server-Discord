<template>
  <div class="users-list">
    <router-link to="/" style="padding: 0;">
      <h1 class="title">🌸 Danh sách đăng ký ({{ users ? users.length : 'none' }}) 🌸</h1>
    </router-link>
    <div class="scrollable-list">
      <ul class="user-grid">
        <li v-for="user in users" :key="user.id" class="user-card">
          <div class="card-content">
            <img :src="user.avatarUrl" alt="Avatar" class="user-avatar" />
            <div class="user-info">
              <h2 class="username">{{ user.globalname ? user.globalname : user.username }} ({{ user.username }})</h2>
              <p class="registration-date">
                <i class="far fa-calendar-alt"></i>
                {{ formatDate(user.registeredAt) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="button-container">
      <router-link to="/" class="register-button">
        <span class="button-content">
          Đăng ký ngay
        </span>
      </router-link>
      <button @click="handleUnsubscribe" class="un-register-button">
        <span class="button-content">
          Huỷ đăng ký
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  globalname: string;
  discriminator: string;
  avatarUrl: string;
  registeredAt: string;
}

export default defineComponent({
  name: 'UsersList',
  data() {
    return {
      users: [] as User[],
    };
  },
  async mounted() {
    const { setTheme } = inject('theme', {
      setTheme: (theme: string) => {
        console.log(theme);
      },
    });

    setTheme('theme-pink');

    const userCollection = collection(db, 'users');
    const userSnapshot = await getDocs(userCollection);
    this.users = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  },
  methods: {
    formatDate(dateStr: string): string {
      const date = new Date(dateStr);
      return date.toLocaleString();
    },

    handleUnsubscribe(): void {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);
      console.log(clientId, redirectUri);

      const scope = 'identify email guilds';
      const state = 'unsubscribe';
      const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      localStorage.setItem('discordState', state);
      window.location.href = url;
    },
  },
});
</script>

<style scoped>
.scrollable-list {
  background: #f7c8d2;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
  margin: 0 -1rem;
  padding: 1rem 1rem;
  border-radius: 10px;
}

.scrollable-list::-webkit-scrollbar {
  width: 8px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: rgba(255, 183, 197, 0.1);
  border-radius: 4px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: #ffb7c5;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: #ff9aa2;
}

.users-list {
  min-height: 100vh;
  padding: 0.5rem 2rem;
  background: #ffdee5;
  background-blend-mode: soft-light;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.title {
  text-align: center;
  font-family: 'Playwrite IN', serif;
  color: #8a4b5f;
  font-size: 2rem;
  margin-bottom: 1rem;
  position: relative;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0;
  position: relative;
}

.user-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  list-style: none;
  border: 1px solid rgba(255, 183, 197, 0.3);
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(138, 75, 95, 0.2);
}

.card-content {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid #ffb7c5;
  margin-right: 1.5rem;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.username {
  color: #6d394f;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.discriminator {
  color: #b88a9e;
  font-weight: 400;
}

.registration-date {
  color: #8a4b5f;
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 2rem 0;
  position: sticky;
  bottom: 20px;
  z-index: 10;
}

.register-button {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #e42041 0%, #f55899 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 117, 140, 0.3);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.un-register-button {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 117, 140, 0.3);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.register-button::before, .un-register-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.register-button:hover, .un-register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 117, 140, 0.4);
}

.register-button:hover::before, .un-register-button:hover::before {
  left: 100%;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.fa-blossom {
  font-size: 1.3em;
  animation: blossom 1.5s ease-in-out infinite;
}

@keyframes blossom {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(15deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@media (max-width: 768px) {
  .scrollable-list {
    max-height: 65vh;
    margin: 0 -0.5rem;
    padding: 0 0.5rem;
  }

  .user-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.4rem;
  }

  .button-container {
    margin: 1.5rem 0;
  }

  .register-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }

  .users-list {
    padding: 0.5rem;
  }

  .user-card {
    padding: 0.75rem;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    margin-right: 0.75rem;
  }

  .username {
    font-size: 0.95rem;
    margin-bottom: 0;
  }

  .registration-date {
    display: none;
  }

  .card-content {
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
  }
}
</style>
