<template>
  <div class="dashboard-container">
    <Chart />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import Chart from '@/components/Chart.vue';

export default defineComponent({
  name: 'Dashboard',
  components: { Chart },
  setup() {
    const store = useStore();

    onMounted(async () => {
      store.commit('sales/setChartLoading', true);
      await store.dispatch('user/fetchUserInfo');

      const sellerId = store.getters['user/sellerId'];
      const marketplace = store.getters['user/marketplace'];

      if (sellerId && marketplace) {
        await store.dispatch('sales/fetchSalesData', 30);
      }
      store.commit('sales/setChartLoading', false);
    });
  }
});
</script>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
  gap: 2rem;
  background: url('@/assets/dashboard.jpg') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}
</style>