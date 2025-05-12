import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faEye,
  faEyeSlash,
  faChevronUp,
  faChevronDown,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';

Highcharts.setOptions({
  lang: {
    decimalPoint: ',',
    thousandsSep: '.'
  }
});

library.add(faEye, faEyeSlash, faChevronUp, faChevronDown, faSignOutAlt);

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');

if (token) store.commit('auth/setToken', token);
if (email) store.commit('auth/setEmail', email);

const app = createApp(App);

app.use(router);
app.use(store);
app.use(PrimeVue);
app.use(HighchartsVue);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');