import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/controllers/home.vue';
import Login from '@/controllers/login.vue';
import Profile from '@/controllers/profile.vue';
import ProfileEdit from '@/controllers/profile-edit.vue';
import Signup from '@/controllers/signup.vue';
import ResetPassword from '@/controllers/reset-password.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/member/:id', name: 'profile', component: Profile },
  { path: '/signup', name: 'signup', component: Signup },
  { path: '/member/:id/edit', name: 'profile-edit', component: ProfileEdit },
  { path: '/reset-password', name: 'reset-password', component: ResetPassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }

    return { top: 0 };
  },
});

export default router;
