import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import DashboardLayout from '../layout/DashboardLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import Ingredients from '@/views/Ingredients.vue';
import Categories from '@/views/Categories.vue';
import Help from '@/views/Help.vue';
// import Settings from '../views/Settings.vue';

const routes = [
  { path: '/', component: Login, name: 'Login' },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: Dashboard, name: 'Dashboard' },
      { path: 'ingredients', component: Ingredients, name: 'Ingredients' },
      { path: 'categories', component: Categories, name: 'Categories' },
      { path: 'help', component: Help, name: 'Help' }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
