import { createRouter, createWebHistory } from 'vue-router'
import CallbackPage from '../pages/CallbackPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import UsersList from '@/views/UsersList.vue';
import Error from '@/views/Error.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginPage,
    },
    {
      path: '/callback',
      name: 'CallBack',
      component: CallbackPage,
    },
    {
      path: '/users',
      name: 'Users',
      component: UsersList,
    },
    {
      path: '/error',
      name: 'Error',
      component: Error,
    }
  ],
})

export default router
