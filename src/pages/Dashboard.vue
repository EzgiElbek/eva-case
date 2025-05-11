<template>
  <div class="dashboard-container">
    <Chart/>
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
      await store.dispatch('user/fetchUserInfo');

      const sellerId = store.getters['user/sellerId'];
      const marketplace = store.getters['user/marketplace'];

      if (sellerId && marketplace) {
        await store.dispatch('sales/fetchSalesData', 30);
      }
    });
  }
});
</script>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  height: 100vh;
  background: url('@/assets/dashboard.jpg') no-repeat center center / cover;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
</style>