import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/controllers/home.vue';
import Login from '@/controllers/login.vue';
import Profile from '@/controllers/profile.vue';
import ProfileEdit from '@/controllers/profile-edit.vue';
import Signup from '@/controllers/signup.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/member/:id', name: 'profile', component: Profile },
  { path: '/signup', name: 'signup', component: Signup },
  { path: '/member/:id/edit', name: 'profile-edit', component: ProfileEdit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
