import axios from 'axios';
import { ActionContext } from 'vuex';

interface UserState {
  marketplace: string;
  sellerId: string;
}

const state = (): UserState => ({
  marketplace: '',
  sellerId: ''
});

const mutations = {
  setUserInfo(state: UserState, payload: { marketplace: string; sellerId: string }) {
    state.marketplace = payload.marketplace;
    state.sellerId = payload.sellerId;
  }
};

const actions = {
  async fetchUserInfo({ commit, rootGetters }: ActionContext<UserState, any>) {
    try {
      const token = rootGetters['auth/token'];
      const email = rootGetters['auth/email'];

      const response = await axios.post('https://iapitest.eva.guru/user/user-information', { email }, { headers: { Authorization: `Bearer ${token}` } });

      const store = response.data?.Data?.user?.store?.[0];
      if (store) {
        commit('setUserInfo', {
          marketplace: store.marketplaceName,
          sellerId: store.storeId
        });
      } else {
        console.error('User store data is missing.');
      }
    } catch (error) {
      console.error('Failed to fetch user information:', error);
    }
  }
};

const getters = {
  marketplace: (state: UserState): string => state.marketplace,
  sellerId: (state: UserState): string => state.sellerId
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};