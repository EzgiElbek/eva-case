import axios from 'axios';
import { ActionContext } from 'vuex';

interface SalesState {
  chartData: any[];
}

const state: SalesState = {
  chartData: []
};

const mutations = {
  setChartData(state: SalesState, payload: any[]) {
    state.chartData = payload;
  }
};

const actions = {
  async fetchSalesOverview({ commit, rootGetters }: ActionContext<SalesState, any>, day: number) {
    try {
      const token = rootGetters['auth/token'];
      const sellerId = rootGetters['user/sellerId'];
      const marketplace = rootGetters['user/marketplace'];

      const payload = {
        marketplace,
        sellerId,
        requestStatus: 0,
        day: 30,
        excludeYoYData: true
      };

      const response = await axios.post('https://iapitest.eva.guru/data/daily-sales-overview', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      commit('setChartData', response.data.Data.item);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    }
  }
};

const getters = {
  chartData: (state: SalesState) => state.chartData
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
