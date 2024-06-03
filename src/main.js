import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import services from '@Services/index.js';
import axios from 'axios';
import moment from 'moment';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ElementPlus from 'element-plus';
import 'moment/dist/locale/en-ca';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import VueDatePicker from '@vuepic/vue-datepicker';


/**
 * CSS FILES
 */
import '@iconscout/unicons/css/line.css';
import '@Assets/css/main.css';
import '@Assets/css/dataTable.css';

import App from './App.vue';

services.setURL(import.meta.env.VITE_APP_API_URL);
moment.locale('en-ca');

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
   .use(router, axios)
   .use(ElementPlus)
   .component('VueDatePicker', VueDatePicker)
   .component('EasyDataTable', Vue3EasyDataTable)
   .mount('#app');
    