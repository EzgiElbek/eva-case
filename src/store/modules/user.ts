import axios from 'axios';
import { ActionContext } from 'vuex';

interface UserState {
  marketplace: string;
  sellerId: string;
}

const state: UserState = {
  marketplace: '',
  sellerId: ''
};

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
      const email = rootGetters['auth/email']
      const response = await axios.post('https://iapitest.eva.guru/user/user-information', {email: email},
        { headers: {Authorization: `Bearer ${token}` } });

      const data = response.data.Data;
      commit('setUserInfo', {
        marketplace: data.user.store[0].marketplaceName,
        sellerId: data.user.store[0].storeId
      });
    } catch (error) {
      console.error('Failed to user information:', error);
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