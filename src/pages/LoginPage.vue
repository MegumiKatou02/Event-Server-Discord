<template>
  <div class="login-page">
    <div class="animated-background">
      <div v-for="n in 30" :key="n" class="petal"></div>
    </div>

    <div class="login-container" :class="{ 'hover-tilt': isHovering }"
         @mouseenter="isHovering = true"
         @mouseleave="isHovering = false">

      <button @click="toggleTheme" class="theme-toggle">
        {{ isDarkTheme ? '🌙' : '🌸' }}
      </button>

      <div class="content-wrapper">
        <div class="logo-container">
          <img title="The, cai avt nay xau vc"  id="server-image" @click="redirectUrl('https://github.com/MegumiKatou02/Event-Server-Discord')" src="/images/server-image.png" alt="Server Image">
        </div>

        <h1 class="title">Khu Wibu Discord</h1>
        <p class="subtitle">Chao mung cac con nghien den vi giveaway</p>

        <div class="login-button-container">
          <a :href="loginUrl" class="login-button">
            <span class="button-content">
              <svg class="discord-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
            </svg>
            Đăng nhập với Discord
          </span>
        </a>

        <router-link to="/users" class="login-button" style="margin-top: 1rem;">
          <span class="button-content">Xem danh sách</span>
        </router-link>
      </div>

      <div class="footer">
        <p class="terms">By continuing, you agree to our
          <a href="https://khu-wibu-page.vercel.app/privacy-policy.html#terms" class="hover-underline">Terms</a> and
          <a href="https://khu-wibu-page.vercel.app/privacy-policy.html#privacy" class="hover-underline">Privacy</a>
        </p>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.theme-dark {
  background: linear-gradient(135deg, #1a1c1f 0%, #2a1f26 100%);
}

.login-container {
  width: 95%;
  max-width: 420px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(255, 182, 193, 0.15);
  position: relative;
  backdrop-filter: blur(8px);
  text-align: center;
}

.theme-dark .login-container {
  background: rgba(31, 29, 43, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

#server-image {
  border-radius: 100px;
  cursor: pointer;
  width: 100px;
  height: 100px;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #ff99b6;
  margin: 0;
}

.theme-dark .title {
  color: #ffb6c1;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.theme-dark .subtitle {
  color: #b9bbbe;
}

.login-button-container {
  width: 100%;
  margin: 1.5rem 0;
}

.login-button {
  display: block;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #ffb6c1, #ff99b6);
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 182, 193, 0.4);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.discord-icon {
  width: 24px;
  height: 24px;
}

.footer {
  margin-top: 1rem;
}

.terms {
  font-size: 0.8rem;
  color: #666;
}

.theme-dark .terms {
  color: #72767d;
}

.hover-underline {
  color: #ff99b6;
  text-decoration: none;
  position: relative;
}

.theme-dark .hover-underline {
  color: #ffb6c1;
}

.petal {
  position: absolute;
  width: 15px;
  height: 15px;
  background: #ffb6c1;
  border-radius: 150% 0 150% 0;
  animation: falling 10s infinite linear;
  opacity: 0.6;
}

@keyframes falling {
  0% {
    top: -10%;
    left: random(100) * 1%;
    transform: rotate(0deg);
  }
  100% {
    top: 100%;
    left: calc(random(100) * 1% - 20%);
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.75rem;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from 'vue';
import { CurrentEvent } from '@/services/firebaseService';

export default defineComponent({
  setup() {
    const isHovering = ref(false);

    const {isDarkTheme, toggleTheme, setTheme } = inject('theme', {
      isDarkTheme: ref(false),
      toggleTheme: () => {},
      setTheme: (theme: string) => {console.log(theme);}
    });

    const redirectUrl = (url: string) => {
      window.location.href = url;
    }

    onMounted(() => {
      isDarkTheme.value = false;
      const theme = localStorage.getItem('theme');
      if (theme) {
        setTheme(theme);
        isDarkTheme.value = theme === 'theme-dark';
      }
      else {
        setTheme('theme-normal');
      }
    });

    return {
      isDarkTheme,
      isHovering,
      toggleTheme,
      redirectUrl,
      CurrentEvent,
    };
  },
  computed: {
    loginUrl(): string {
      (async () => {
        const eventId = await this.CurrentEvent();
        localStorage.setItem('eventId', eventId.toString().trim());
      })();

      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);

      const scope = 'identify guilds';
      const state = 'subscribe';
      const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
      localStorage.setItem('discordState', state);
      return url;
    }
  }
});
</script>
