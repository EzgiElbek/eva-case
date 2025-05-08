<template>
    <highcharts :options="chartOptions" />
</template>
  
<script lang="ts">
    import { defineComponent, computed } from 'vue';
    import { useStore } from 'vuex';
  
    export default defineComponent({
        name: 'Chart',
        setup() {
            const store = useStore();

            const chartData = computed(() => store.getters['sales/chartData']);
            const chartOptions = computed(() => {
                const categories = chartData.value.map((item: any) => item.date);

                return {
                    chart: {
                        type: 'column',
                        borderRadius: 15
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
                        title: {
                            text: 'Amount ($)',
                            margin: 20
                        }
                    },
                    tooltip: {
                        shared: true,
                        formatter(this: any) {
                        const point = this.points?.[0]?.point.options;
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
                                        console.log('Clicked date:', this.date);
                                    }
                                }
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Profit',
                            stack: 'sales',
                            data: chartData.value.map((item: any) => ({
                                y: item.profit,
                                date: item.date,
                                ...item
                            })),
                            color: '#71ebc5'
                        },
                        {
                            name: 'FBA',
                            stack: 'sales',
                            data: chartData.value.map((item: any) => ({
                                y: item.fbaAmount,
                                ...item
                            })),
                            color: '#8284e7'
                        },
                        {
                            name: 'FBM',
                            stack: 'sales',
                            data: chartData.value.map((item: any) => ({
                                y: item.fbmAmount,
                                ...item
                            })),
                            color: '#8968ec'
                        }
                    ]
                };
            });

            return {
                chartOptions
            };
        }
    });
</script>  