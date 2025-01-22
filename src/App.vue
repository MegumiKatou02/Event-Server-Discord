<template>
  <div id="app" :class="isDarkTheme ? 'theme-dark': 'theme-normal'">
     <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const isDarkTheme = ref(false);

    const toggleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
    };

    const setTheme = (isDark: boolean) => {
      isDarkTheme.value = isDark;
    };

    provide('theme', {
      isDarkTheme,
      toggleTheme,
      setTheme,
    });

    return {
      isDarkTheme,
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
}

.theme-dark {
  background-color: #2a2835;
  color: #f5f5f5;
}

.theme-normal {
  background-color: #f8d9e1;
  color: #333;
}
</style>
