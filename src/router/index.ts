import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import DashboardLayout from '../layout/DashboardLayout.vue';
import Dashboard from '../views/Dashboard.vue';
// import Settings from '../views/Settings.vue';

const routes = [
  { path: '/', component: Login, name: 'Login' },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: Dashboard, name: 'Dashboard' },
    //   { path: 'settings', component: Settings, name: 'Settings' }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
