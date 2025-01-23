<template>
  <div class='error-page'>
    <div class="error-container" :class="whichTheme">
      <div class="error-icon">
        <img width="110px" height="110px" src="/images/error-image.png" alt="Error Image">
      </div>
      <h1>Oops! Có lỗi xảy ra</h1>
      <p class="error-message">{{ errorMessage }}</p>
      <router-link to="/" class="home-button">
        Về trang chủ
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject, ref } from 'vue';

export default defineComponent({
  name: 'ErrorPage',
  setup() {
    const whichTheme = ref<string>('theme-normal');

    onMounted(() => {
      const theme = localStorage.getItem('theme');
      const { setTheme } = inject('theme', {
        setTheme: (theme: string) => {
          console.log(theme);
        },
      });
      if (theme) {
        setTheme(theme);
        whichTheme.value = theme;
      } else {
        setTheme('theme-normal');
      }
    });

    return {
      whichTheme,
    }
  },
  computed: {
    errorMessage() {
      return this.$route.query.message || 'Đã xảy ra lỗi không xác định';
    }
  }
});
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.error-container {
  text-align: center;
  background-color: white;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.error-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 15px;
}

.error-message {
  color: #ec5c5c;
  margin-bottom: 25px;
  font-size: large;
  font-weight: bold;
}

.theme-dark {
  background-color: #1f1c2a;
}

.home-button {
  display: inline-block;
  background-color: #f795a3;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #fa768a;
}

.theme-dark {
  color: #f5f5f5;
}
</style>
