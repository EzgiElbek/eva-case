import { createApp } from 'vue';
import App from './App.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts'; 

import router from './router';
import store from './store';

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');

if (token) {
    store.commit('auth/setToken', token);
}
if (email) {
    store.commit('auth/setEmail', email);
}

Highcharts.setOptions({
    lang: {
      decimalPoint: ',',
      thousandsSep: '.'
    }
});

library.add(faEye, faEyeSlash);

const app = createApp(App);

app.use(router);
app.use(store);
app.use(HighchartsVue); 
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');