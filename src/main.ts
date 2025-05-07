import { createApp } from 'vue';
import App from './App.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import router from './router';
import store from './store';

library.add(faEye, faEyeSlash);

const app = createApp(App);

app.use(router);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');