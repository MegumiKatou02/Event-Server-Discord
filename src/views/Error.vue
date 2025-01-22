<template>
  <div class="error-page">
    <h1>Lỗi</h1>
    <p>{{ errorMessage }}</p>
    <router-link to="/">Về trang chủ</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorPage',
  computed: {
    errorMessage() {
      return this.$route.query.message || 'Đã xảy ra lỗi không xác định';
    }
  }
});
</script>
