<template>
    <div v-if="tableData.length > 0" class="sales-table-wrapper">
        <div class="search-wrapper">
            <font-awesome-icon :icon="faSearch" class="search-icon" />
            <InputText v-model="filterText" placeholder="Search SKU..." class="search-input" />
        </div>

        <DataTable :value="filteredData" :paginator="true" :rows="10" @page="onPageChange">
            <template #empty>
                <div class="no-data">No matching data found.</div>
            </template>
            <Column field="sku" header="SKU" :filter="true" filterPlaceholder="Search SKU" :showFilterMenu="false" />
            <Column v-if="selectedFirstDate">
                <template #header>
                    <div class="table-header">
                        {{ selectedFirstDate }}<br />
                        Sales / Units<br />
                        Avg. Selling Price
                    </div>
                </template>
                <template #body="slotProps">
                    <div class="cell-value green">
                        <span v-html="formatValue(slotProps.data.amount, slotProps.data.qty)"></span>
                    </div>
                </template>
            </Column>
            <Column v-if="selectedSecondDate">
                <template #header>
                    <div class="table-header">
                        {{ selectedSecondDate }}<br />
                        Sales / Units<br />
                        Avg. Selling Price
                    </div>
                </template>
                <template #body="slotProps">
                    <div class="cell-value turquoise">
                        <span v-html="formatValue(slotProps.data.amount2, slotProps.data.qty2)"></span>
                        <font-awesome-icon
                            v-if="getFormatIcon(slotProps.data.amount2, slotProps.data.qty2, slotProps.data.amount, slotProps.data.qty)"
                            :icon="getFormatIcon(slotProps.data.amount2, slotProps.data.qty2, slotProps.data.amount, slotProps.data.qty)"
                            class="arrow-icon"
                        />
                    </div>
                </template>
            </Column>
            <Column header="SKU Refund Rate">
                <template #body="slotProps">
                    <span>${{ (slotProps.data.refundRate || 0).toFixed(2) }}</span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
  
<script lang="ts">
    import { defineComponent, PropType, ref, computed, watch } from 'vue';
    import { useStore } from 'vuex';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import InputText from 'primevue/inputtext';
    import { faChevronUp, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';

    export default defineComponent({
        name: 'SalesTable',
        components: { DataTable, Column, InputText },
        props: {
            tableData: {
                type: Array as PropType<any[]>,
                required: true
            },
            selectedFirstDate: {
                type: String,
                required: true
            },
            selectedSecondDate: {
                type: String,
                required: false
            }
        },
        setup(props) {
            const store = useStore();

            const currentPage = ref(1);
            const totalRecords = ref(0);
            const filterText = ref('');

            const formatValue = (amount: number, qty: number): string => {
                const avg = qty ? (amount / qty).toFixed(2) : '0.00';
                return `$${amount?.toFixed(2) || '0.00'} / ${qty}<br><strong>$${avg}</strong>`;
            };

            const getFormatIcon = (currentAmount: number, currentQty: number, prevAmount: number, prevQty: number): string | null => {
                const avg = currentQty ? currentAmount / currentQty : 0;
                const prevAvg = prevQty ? prevAmount / prevQty : 0;

                if (avg > prevAvg) return faChevronUp;
                if (avg < prevAvg) return faChevronDown;
                return null;
            };

            const getHeader = (date: string): string => {
                if (!date) return '';
                return `${date}<br>Sales / Units<br>Avg. Selling Price`;
            };

            const formatRefund = (value: number): string => {
                return `$${value?.toFixed(2) || '0.00'}`;
            };

            const filteredData = computed(() =>
                props.tableData.filter(item =>
                item.sku.toLowerCase().includes(filterText.value.toLowerCase())
                )
            );

            const onPageChange = (event: any) => {
                const newPage = event.page + 1;
                currentPage.value = newPage;

                store.dispatch('sales/fetchTableData', {
                    firstDate: props.selectedFirstDate,
                    secondDate: props.selectedSecondDate,
                    pageNumber: Math.ceil(newPage / 3)
                });
            };

            watch(() => [props.selectedFirstDate, props.selectedSecondDate], () => {
                filterText.value = '';
            });

            return {
                formatValue,
                getFormatIcon,
                formatRefund,
                getHeader,
                onPageChange,
                filteredData,
                totalRecords,
                faChevronUp,
                faChevronDown,
                faSearch,
                filterText
            };
        }
    });
</script>
  
<style lang="scss" scoped>
.sales-table-wrapper {
    margin-top: 2rem;

    .table-header {
        text-align: left;
        font-weight: 600;
        line-height: 1.4;
        white-space: pre-line;
    }

    .search-wrapper {
        position: relative;
        display: inline-block;
        margin-bottom: 10px;

        .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #888;
            font-size: 0.9rem;
            pointer-events: none;
        }

        .search-input {
            padding-left: 30px !important;
        }
    }

    .cell-value {
        display: flex;
        align-items: center;
        font-weight: 500;
        line-height: 1.4;
        gap: 30px;
    }

    .cell-value.green {
        color: #28a745;
    }

    .cell-value.turquoise {
        color: #17a2b8;
    }

    .arrow-icon {
        color: red;
        font-size: 0.8rem;
    }

    .no-data {
        text-align: center;
        color: #999;
        font-size: 1rem;
        padding: 1rem;
    }
}
</style>  