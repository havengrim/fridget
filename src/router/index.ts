import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import DashboardLayout from '../layout/DashboardLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import Ingredients from '@/views/Ingredients.vue';
import Categories from '@/views/Categories.vue';
import Help from '@/views/Help.vue';
import SignUp from '@/views/SignUp.vue';

// ✅ Define routes
const routes = [
  { path: '/', component: Login, name: 'Login' },
  { path: '/signup', component: SignUp, name: 'SignUp' },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true }, // 🔒 Protect dashboard
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

// ✅ Use async function and return navigation path
router.beforeEach((to:any) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/'; // Redirect unauthenticated users to login
  }
});

export default router;
