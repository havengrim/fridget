import { createApp } from 'vue';
import './style.css';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue';
import router from './router';
import 'maz-ui/css/main.css';
import { installToaster } from 'maz-ui'; // ✅ Correct import
import type { ToasterOptions } from 'maz-ui';
const toasterOptions: ToasterOptions = {
    position: 'bottom-right',
    timeout: 10_000,
    persistent: false,
    
};

const app = createApp(App);
const queryClient = new QueryClient()

app.use(VueQueryPlugin, {
  queryClient,
})

app.use(router);
app.use(installToaster, toasterOptions); // ✅ Correct function

app.mount('#app');
