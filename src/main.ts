import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import 'maz-ui/css/main.css';
import { installToaster } from 'maz-ui'; // ✅ Correct import
import type { ToasterOptions } from 'maz-ui';
import { createPinia } from "pinia";
const toasterOptions: ToasterOptions = {
    position: 'bottom-right',
    timeout: 10_000,
    persistent: false,
    
};

const app = createApp(App);
app.use(createPinia());

app.use(router);
app.use(installToaster, toasterOptions); // ✅ Correct function

app.mount('#app');
