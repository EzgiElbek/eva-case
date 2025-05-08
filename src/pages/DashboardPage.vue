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
  name: 'DashboardPage',
  components: {
    Chart
  },

  setup() {
    const store = useStore();

    onMounted(async () => {
      await store.dispatch('user/fetchUserInfo');
      await store.dispatch('sales/fetchSalesOverview', 30);
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
  gap: 2rem;
  padding: 2rem;
}
</style>