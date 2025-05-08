import { createStore } from 'vuex';
import auth from './modules/auth';
import user from './modules/user';
import sales from './modules/sales';

export default createStore({
  modules: {
    auth,
    user,
    sales
  }
});