<template>
    <div class="chart-wrapper">
        <div class="chart-header">
            <font-awesome-icon :icon="faSignOutAlt" class="logout-icon" @click="handleLogout" />
            <Dropdown
                v-model="selectedDay"
                :options="dayOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Day"
                @change="onDayChange"
                class="day-dropdown"
            />
        </div>
        <div class="chart-body">
            <div v-if="isChartLoading" class="chart-loading">
                <span class="spinner"></span>
            </div>
            <highcharts v-if="!isChartLoading && chartData.length" :options="chartOptions" />
        </div>
    </div>
  
    <Table
      v-if="showTable && tableData.length && clickedDates.length"
      :tableData="tableData"
      :selectedFirstDate="clickedDates[0]"
      :selectedSecondDate="clickedDates[1]"
    ></Table>
</template>
  
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import Dropdown from 'primevue/dropdown';
import Table from './Table.vue';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
  
export default defineComponent({
    name: 'Chart',
    components: { Dropdown, Table },
    setup() {
        const store = useStore();
        const router = useRouter();

        const showTable = ref(false);
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

        const getColor = (itemDate: string, baseColor: string): string => {
            if (clickedDates.value[0] === itemDate) return '#28a745';
            if (clickedDates.value[1] === itemDate) return '#17a2b8';
            return baseColor;
        };

        const chartOptions = computed(() => {
            if (!chartData.value.length) return {};

            const maxY = Math.ceil(Math.max(...chartData.value.map((item: any) => item.fbaAmount + item.fbmAmount)) / 1000) * 1000;
            const categories = chartData.value.map((item: any) => item.date);

            return {
                chart: { type: 'column' },
                title: {
                    text: 'Daily Sales',
                    align: 'left',
                    x: 30,
                    y: 30,
                    margin: 50,
                    style: { fontWeight: 'bold', fontSize: '18px' }
                },
                xAxis: { categories, crosshair: true },
                yAxis: {
                    min: 0,
                    max: maxY,
                    tickInterval: maxY / 5,
                    title: { text: 'Amount ($)', margin: 20 }
                },
                tooltip: {
                    shared: true,
                    formatter(this: any) {
                        const point = this.point || this.points?.[0]?.point;
                        return `Total Sales: ${point.fbaAmount + point.fbmAmount}<br/>
                        Shipping: ${point.fbaShippingAmount}<br/>
                        Profit: ${point.profit}<br/>
                        FBA Sales: ${point.fbaAmount}<br/>
                        FBM Sales: ${point.fbmAmount}`;
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
                                        if (clickedDates.value.length > 2) clickedDates.value.shift();
                                    }
                                    activeDate.value = clickedDate;
                                    if (clickedDates.value[0]) {
                                        store.dispatch('sales/fetchTableData', {firstDate: clickedDates.value[0], secondDate: clickedDates.value[1] || ''});
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
                        color: getColor(item.date, '#8284e7')
                    }))
                },
                {
                    name: 'FBM Sales',
                    stack: 'sales',
                    color: '#8968ec',
                    data: chartData.value.map((item: any) => ({
                        ...item,
                        y: item.fbmAmount,
                        color: getColor(item.date, '#8968ec')
                    }))
                }
                ]
            };
        });

        const onDayChange = () => {
            clickedDates.value = [];
            showTable.value = false;
            store.commit('sales/setTableData', []);
            fetchData();
        };

        const fetchData = async () => {
            await store.dispatch('sales/fetchSalesData', selectedDay.value);
        };

        const handleLogout = async () => {
            try {
                const token = store.getters['auth/token'];
                await axios.post('https://iapitest.eva.guru/user/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.warn('Logout failed.', err);
            }

            store.commit('auth/setToken', '');
            store.commit('auth/setEmail', '');
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            router.push('/');
        };
  
      return {
        chartData,
        chartOptions,
        selectedDay,
        dayOptions,
        onDayChange,
        isChartLoading,
        faSignOutAlt,
        showTable,
        clickedDates,
        tableData,
        activeDate,
        handleLogout
      };
    }
});
</script>
  
<style scoped lang="scss">
.chart-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .day-dropdown {
            width: 200px;
        }

        .logout-icon {
            font-size: 1.3rem;
            cursor: pointer;
            transition: color 0.3s;
            margin-left: 10px;
            transform: scaleX(-1);

            &:hover {
                color: white;
            }
        }
    }
    .chart-body {
        position: relative;
        min-height: 300px;

        .chart-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            display: flex;
            align-items: center;
            font-size: 1rem;
            color: #888;

            .spinner {
            width: 3rem;
            height: 3rem;
            margin-right: 0.5rem;
            border: 4px solid #ccc;
            border-top: 4px solid #888;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        }
    }
}
</style>  