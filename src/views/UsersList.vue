<template>
  <QueryPage id="query-page-show" :eventCode="eventId" :users="users" />
  <div class="users-list">
    <div v-if="notificationMessage" class="notification">
      {{ notificationMessage }}
    </div>
    <router-link to="/" style="padding: 0;">
      <h1 class="title">🌸 Danh sách đăng ký ({{ users ? users.length : 'none' }}) 🌸</h1>
    </router-link>
    <div v-if="eventId !== '0'" class="scrollable-list">
      <p class="username user-none" v-if="users.length === 0">Chưa có ai cả, hãy là người đầu tiên đăng ký :3</p>
      <ul class="user-grid">
        <li v-for="user in users" :key="user.id" class="user-card">
          <div class="card-content">
            <img :src="user.avatarUrl" alt="Avatar" class="user-avatar" />
            <div class="user-info">
              <div class="username">
                <h2>{{ user.globalname ? user.globalname : user.username }}</h2>&nbsp;
                <h2>({{ user.username }})</h2>
              </div>
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
      <button
        class="register-button"
        :class="{ 'disabled-button': isEventOver }"
        @click.prevent="isEventOver ? $router.push('/') : handleSubscribe()"
      >
        <span class="button-content">
          {{ !isEventExist ? 'Giveaway chưa mở hoặc không tồn tại' : isEventOver ? 'Giveaway đã kết thúc' : 'Đăng ký ngay' }}
        </span>
      </button>
      <button v-if="!isEventOver"  @click="handleUnsubscribe" class="un-register-button">
        <span class="button-content">
          Huỷ đăng ký
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted, computed, provide, watch } from 'vue';
import { db } from '@/config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
import QueryPage from '@/components/QueryPage.vue';
import { getDateEvent } from '@/services/firebaseService';
import type { User } from '@/types/users';
import { sendNotification } from '@/utils/notification';

export default defineComponent({
  name: 'UsersList',
  setup() {
    const users = ref<User[]>([]);
    const notificationMessage = ref<string>('');
    const $route = useRoute();
    const $router = useRouter();
    const eventEndDate = ref(new Date('2025-01-24T12:00:00').getTime());
    const isEventExist = ref(true);

    const eventId = ref('1');
    let currentEventId = '';

    provide('message', {
      eventId,
      updateMessage: (newValue: string) => {
        eventId.value = newValue;
      },
    });

    provide('userslist', {
      users,
      updateUsers: (usersList: User[]) => {
        users.value = usersList;
      }
    });

    const isEventOver = computed(() => {
      return new Date().getTime() > eventEndDate.value || !isEventExist.value;
    })

    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      return date.toLocaleString();
    };

    const handleSubscribe = (): void => {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);

      const scope = 'identify guilds';
      const state = 'subscribe';
      const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
      localStorage.setItem('discordState', state);
      localStorage.setItem('eventId', eventId.value);
      window.location.href = url;
    }

    const handleUnsubscribe = (): void => {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);

      const scope = 'identify guilds';
      const state = 'unsubscribe';
      const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
      localStorage.setItem('discordState', state);
      localStorage.setItem('eventId', eventId.value);
      window.location.href = url;
    }

    watch(eventId, async (newValue) => {
      if (!newValue || newValue.trim().length >= 3) {
        // console.log('Event ID is empty or invalid');
        sendNotification('Event ID không hợp lệ', 'error', notificationMessage);
        return;
      }
      newValue = newValue.trim();

      currentEventId = newValue;

      $router.push({
        query: { event: newValue }
      })

      try {
        const eventDocRef = doc(db, 'events', newValue);
        const eventDoc = await getDoc(eventDocRef);

        if (currentEventId !== newValue) {
          console.log('Event ID changed during processing, skipping...');
          sendNotification('Event ID bị lỗi', 'error', notificationMessage);
          return;
        }

        if (!eventDoc.exists()) {
          users.value = [];
          isEventExist.value = false;

          return;
        } else {
          isEventExist.value = true;
        }

        const usersRef = collection(db, 'events', newValue, 'users');
        const userSnapshot = await getDocs(usersRef);
        users.value = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        eventEndDate.value = new Date(eventDoc.data().endDate).getTime();
      } catch (error) {
        console.log('Lỗi:', error);
      }
    });

    onMounted(async () => {
      const { setTheme } = inject('theme', {
        setTheme: (theme: string) => {
          console.log(theme);
        },
      });

      setTheme('theme-pink');

      eventEndDate.value = new Date(await getDateEvent(eventId.value)).getTime();

      const userCollection = collection(db, 'events', eventId.value, 'users');
      const userSnapshot = await getDocs(userCollection);

      users.value = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      if ($route.query.event) {
        eventId.value = $route.query.event as string;
      }

      if ($route.query.message) {
        const message: string = $route.query.message as string;
        const status: string = $route.query.status as string
        sendNotification(message, status, notificationMessage, () => {
          $router.replace({ query: { event: eventId.value } })
        });
      }

    });

    return {
      users,
      notificationMessage,
      formatDate,
      handleSubscribe,
      handleUnsubscribe,
      isEventOver,
      eventId,
      isEventExist,
    }
  },
  components: {
    QueryPage,
  },
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
}

.notification.show {
  opacity: 1;
  transform: translateX(0);
}

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
  position: relative;
}

.username {
  margin-right: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  left: 0;
}

.user-none {
  display: flex;
  justify-self: center;
  align-items: center;
}

.username h2, p.username {
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

.register-button,
.un-register-button {
  display: inline-flex;
  align-items: center;
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

.register-button.disabled-button {
  background: linear-gradient(135deg, #cccccc 0%, #727272 100%)
}

.register-button {
  background: linear-gradient(135deg, #e42041 0%, #f55899 100%);
}

.un-register-button {
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
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
  #query-page-show {
    display: none;
  }

  .title {
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scrollable-list {
    max-height: 65vh;
    margin: 0 0.2rem;
    padding: 0.5rem 0.5rem;
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

  .username h2{
    font-size: 0.95rem;
    margin-bottom: 0;
  }

  .card-content {
    align-items: center;
  }

  .user-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .registration-date {
    /* font-size: 0.8rem; */
    align-self: center;
    margin: 0;
  }

  i {
    display: none;
  }
}
</style>
