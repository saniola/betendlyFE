import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/controllers/HelloWorld.vue';
import Login from '@/controllers/login.vue';
import Signup from '@/controllers/signup.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
