import axios from 'axios';
import { ActionContext } from 'vuex';

interface SalesState {
  chartData: any[];
  tableData: any[];
  isChartLoading: boolean;
}

const state: SalesState = {
  chartData: [],
  tableData: [],
  isChartLoading: false
};

const mutations = {
  setChartData(state: SalesState, payload: any[]) {
    state.chartData = payload;
  },
  setTableData(state: SalesState, payload: any[]) {
    state.tableData = payload;
  },
  setChartLoading(state: SalesState, status: boolean) {
    state.isChartLoading = status;
  }
};

const actions = {
  async fetchSalesData({ commit, rootGetters }: ActionContext<SalesState, any>, day: number) {
    commit('setChartLoading', true);
    try {
      const token = rootGetters['auth/token'];
      const sellerId = rootGetters['user/sellerId'];
      const marketplace = rootGetters['user/marketplace'];

      const payload = {
        customDateData: null,
        marketplace,
        sellerId,
        requestStatus: 0,
        day: day,
        excludeYoYData: true
      };

      //Daily Sales Overview
      const response = await axios.post('https://iapitest.eva.guru/data/daily-sales-overview', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      commit('setChartData', response.data.Data.item);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      commit('setChartLoading', false);
    }
  },

  async fetchTableData({ commit, rootGetters }: ActionContext<SalesState, any>, { firstDate, secondDate }: { firstDate: string; secondDate?: string }) {
    try {
      const token = rootGetters['auth/token'];
      const sellerId = rootGetters['user/sellerId'];
      const marketplace = rootGetters['user/marketplace'];
  
      //Daily Sales Sku
      const skuListResponse = await axios.post('https://iapitest.eva.guru/data/daily-sales-sku-list', {
        isDaysCompare: secondDate ? 1 : 0,
        marketplace,
        sellerId,
        salesDate: firstDate,
        salesDate2: secondDate || "",
        pageNumber: 1,
        pageSize: 30
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const skuList = skuListResponse.data.Data.item.skuList;

      //Sku Refund Rate
      const refundResponse = await axios.post('https://iapitest.eva.guru/data/get-sku-refund-rate', {
        marketplace,
        sellerId,
        skuList: skuList.map((item: any) => item.sku)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const refundRates = refundResponse.data.Data;

      const mergedList = skuList.map((item: any) => {
        const refund = refundRates.find((r: any) => r.sku === item.sku);
        return {
          ...item,
          refundRate: refund ? refund.refundRate : ''
        };
      });
  
      commit('setTableData', mergedList);
    } catch (error) {
      console.error('Failed to fetch table data:', error);
    }
  },


};

const getters = {
  chartData: (state: SalesState) => state.chartData,
  tableData: (state: SalesState) => state.tableData,
  isChartLoading: (state: SalesState) => state.isChartLoading
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
