<template>
  <div id="app" :class="whichTheme">
    <div class="cherry-blossoms">
      <span v-for="n in 50" :key="n" class="blossom"></span>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const isDarkTheme = ref(false);
    const whichTheme = ref<string>('theme-normal');

    const toggleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
      whichTheme.value = isDarkTheme.value ? 'theme-dark' : 'theme-normal';
      setTheme(whichTheme.value);
    };

    const setTheme = (theme: string) => {
      if (theme === 'theme-normal' || theme === 'theme-dark') {
        localStorage.setItem('theme', theme);
      }
      whichTheme.value = theme;
    };

    provide('theme', {
      isDarkTheme,
      toggleTheme,
      setTheme,
    });

    return {
      isDarkTheme,
      whichTheme,
    };
  },
});
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.theme-dark {
  background-color: #1f1c2a;
  color: #f5f5f5;
}

.theme-normal {
  background-color: #ffffff;
  color: #333;
}

.theme-pink {
  background-color: #ffdee5;
}

.cherry-blossoms {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.blossom {
  position: absolute;
  display: block;
  width: 12px;
  height: 12px;
  background: #ffd7e6;
  border-radius: 12px;
  animation: fall linear infinite;
  opacity: 0;
}

.theme-dark .blossom {
  background: #ff99bb;
}

.theme-pink .blossom {
  background: #f877a2;
}

@keyframes fall {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotateZ(0deg);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(100px, 100vh) rotateZ(360deg);
  }
}

.blossom::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: 12px;
  transform: rotate(60deg);
}

.blossom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24%;
  height: 24%;
  background: #fff5f8;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.cherry-blossoms .blossom:nth-child(even) {
  animation-duration: 6s;
  animation-delay: 0s;
  left: 5%;
}

.cherry-blossoms .blossom:nth-child(3n) {
  animation-duration: 7s;
  animation-delay: 1s;
  left: 15%;
}

.cherry-blossoms .blossom:nth-child(5n) {
  animation-duration: 8s;
  animation-delay: 2s;
  left: 25%;
}

.cherry-blossoms .blossom:nth-child(7n) {
  animation-duration: 9s;
  animation-delay: 3s;
  left: 35%;
}

.cherry-blossoms .blossom:nth-child(11n) {
  animation-duration: 10s;
  animation-delay: 4s;
  left: 45%;
}

.cherry-blossoms .blossom:nth-child(13n) {
  animation-duration: 11s;
  animation-delay: 5s;
  left: 55%;
}

.cherry-blossoms .blossom:nth-child(17n) {
  animation-duration: 12s;
  animation-delay: 6s;
  left: 65%;
}

.cherry-blossoms .blossom:nth-child(19n) {
  animation-duration: 13s;
  animation-delay: 7s;
  left: 75%;
}

.cherry-blossoms .blossom:nth-child(23n) {
  animation-duration: 14s;
  animation-delay: 8s;
  left: 85%;
}

.cherry-blossoms .blossom:nth-child(29n) {
  animation-duration: 15s;
  animation-delay: 9s;
  left: 95%;
}
</style>
