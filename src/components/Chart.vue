<template>
    <div class="chart-wrapper">
        <div class="chart-header">
            <Dropdown v-model="selectedDay" :options="dayOptions" optionLabel="label" optionValue="value" placeholder="Select Day" @change="onDayChange" class="day-dropdown"></Dropdown>
        </div>
        <div class="chart-body">
            <div v-if="isChartLoading" class="chart-loading">
                <span class="spinner"></span>
            </div>
            <highcharts v-else :options="chartOptions" />
        </div>
    </div>
  <Table v-if="showTable && tableData && tableData.length > 0 && clickedDates.length > 0" :tableData="tableData" :selectedFirstDate="clickedDates[0]" :selectedSecondDate="clickedDates[1]"></Table>
</template>
  
<script lang="ts">
    import { defineComponent, computed, ref } from 'vue';
    import { useStore } from 'vuex';
    import Dropdown from 'primevue/dropdown';
    import Table from './Table.vue'

    export default defineComponent({
        name: 'Chart',
        components: { Dropdown, Table },
        setup() {
            const store = useStore();

            const showTable = ref<boolean>(false);
            const clickedDates = ref<string[]>([]);
            const activeDate = ref<string | null>(null);
            const selectedDay = ref(30);
            const dayOptions = ref([
                { label: 'Last 7 Days', value: 7 },
                { label: 'Last 14 Days', value: 14 },
                { label: 'Last 30 Days', value: 30 },
                { label: 'Last 60 Days', value: 60 }
            ]);

            const chartData = computed(() => store.getters['sales/chartData']);
            const tableData = computed(() => store.getters['sales/tableData']);
            const isChartLoading = computed(() => store.getters['sales/isChartLoading']);

            const chartOptions = computed(() => {
                if (!chartData.value || chartData.value.length === 0) return {};

                const maxY = Math.ceil(Math.max(...chartData.value.map((item: any) => item.fbaAmount + item.fbmAmount)) / 1000) * 1000;
                const categories = chartData.value.map((item: any) => item.date);

                return {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Daily Sales',
                        align: 'left',
                        x: 30,
                        y: 30,
                        margin: 50,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }
                    },
                    xAxis: {
                        categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        max: maxY,
                        tickInterval: maxY / 5,
                        title: {
                            text: 'Amount ($)',
                            margin: 20
                        }
                    },
                    tooltip: {
                        shared: true,
                        formatter(this: any) {
                            const point = this.point || this.points?.[0]?.point;
                            return `Total Sales: ${point.fbaAmount + point.fbmAmount}<br/>
                                Shipping: ${point.fbaShippingAmount}<br/>
                                Profit: ${point.profit}<br/>
                                FBA Sales: ${point.fbaAmount}<br/>
                                FBM Sales: ${point.fbmAmount}
                            `;
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            grouping: true,
                            pointPadding: 0.1,
                            borderWidth: 0,
                            borderRadius: 0,
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click(this: any) {
                                        const clickedDate = this.date;

                                        if (!clickedDates.value.includes(clickedDate)) {
                                            clickedDates.value.push(clickedDate);
                                            if (clickedDates.value.length > 2) {
                                                clickedDates.value.shift();
                                            }
                                        }
                                        activeDate.value = clickedDate;
                                        
                                        if (clickedDates.value[0]) {
                                            store.dispatch('sales/fetchTableData', {firstDate: clickedDates.value[0], secondDate: clickedDates.value[1] || ""});
                                            showTable.value = true;
                                        }
                                    }
                                }
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Profit',
                            stack: 'sales',
                            color: '#71EBC5',
                            data: chartData.value.map((item: any) => ({
                                ...item,
                                y: item.profit,
                                date: item.date
                            }))
                        },
                        {
                            name: 'FBA Sales',
                            stack: 'sales',
                            color: '#8284e7',
                            data: chartData.value.map((item: any) => ({
                                ...item,
                                y: item.fbaAmount,
                                color: clickedDates.value[0] === item.date ? '#28a745' : clickedDates.value[1] === item.date ? '#17a2b8' : '#8284e7'       
                            }))
                        },
                        {
                            name: 'FBM Sales',
                            stack: 'sales',
                            color: '#8968ec',
                            data: chartData.value.map((item: any) => ({
                                ...item,
                                y: item.fbmAmount,
                                color: clickedDates.value[0] === item.date ? '#28a745' : clickedDates.value[1] === item.date ? '#17a2b8' : '#8968ec'
                            })),
                        }
                    ]
                };
            });

            const onDayChange = () => {
                fetchData();
            };

            const fetchData = async () => {
                store.commit('sales/setChartLoading', true);
                await store.dispatch('sales/fetchSalesData', selectedDay.value);
                store.commit('sales/setChartLoading', false);
            };

            return {
                chartOptions,
                selectedDay,
                dayOptions,
                onDayChange,
                isChartLoading,
                showTable,
                clickedDates,
                tableData,
                activeDate
            };
        }
    });
</script>

<style scoped lang="scss">
.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-header {
  display: flex;
  justify-content: flex-end;
}

.day-dropdown {
  width: 200px;
}

.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1rem;
  color: #888;

  .spinner {
    width: 5rem;
    height: 5rem;
    margin-right: 0.5rem;
    border: 2px solid #ccc;
    border-top: 2px solid #888;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>