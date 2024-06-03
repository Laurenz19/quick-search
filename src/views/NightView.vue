<template>
  <div>
    <div class="relative search__input mt-5">
      <!--<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>-->
      <div class="table__head">
        <!--<input type="search" v-model="searchValue" id="default-search" class="block p-1  m-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search" required>-->
        <div></div>
        <button class="btn" @click="showExport = true">
          <i class="uil uil-file-download"></i>
          Export
        </button>
      </div>
    </div>
    <EasyDataTable 
      class="mt-5" 
      :headers="headers" 
      :items="items" 
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength" 
      :loading="loading" 
      :search-field="searchField" 
      :search-value="searchValue"
      buttons-pagination theme-color="#6c63ff" 
      table-class-name="customize-table"
      must-sort>
      <template #item-nights="item">
        <span class="bg-red-100 text-red-800 text-xs rounded font-medium mr-2 px-2.5 py-0.5">{{ formatNumber(item.nights)
          || 0 }}</span>
      </template>
      <template #item-destination="item">
       {{ item.destination
          || "-" }}
      </template>
      <template #item-occupancy_rate="item">
        {{ Number(item.occupancy_rate).toFixed(2) }}
      </template>
      <template #item-fill_rate="item">
        {{ Number(item.fill_rate).toFixed(2) }}
      </template>
      <template #item-period="item">
        <span
          :class="['text-md font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700  border', item.period.includes('ETE') ? 'bg-yellow-100 text-yellow-800 dark:text-yellow-300 border-yellow-300' : 'bg-blue-100 text-blue-800 dark:text-blue-400 border-blue-400']">
          {{ item.period }}</span>
      </template>
      <template #item-operation="item">
        <div class="operation-wrapper">
          <button v-if="item.nights>0" @click="nightPerWeek(item)">show</button>
        </div>
      </template>
    </EasyDataTable>
    <ModalComponent :showModal="show" @close="show = false" :height="85" :width="70">
      <template #content>
        <div class="modal__close">
          <i class="uil uil-times-circle mb-8" @click="show = false"></i>
        </div>
        <div class="modal__header">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Night per week</h3>
        </div>
        <div class="station__name">
          <span>{{ freq.stations }} - {{ freq.category }}</span>
        </div>
        <div class="relative overflow-x-auto table__modal mt-4">
          <NightPerWeekComponent />
        </div>
      </template>
    </ModalComponent>
    <!-- <ExportcsvexcelComponent :showModal="showExport" :downloaded="downloaded"
      @close="showExport = false, downloaded = false" @submit="(data) => exportData('table', data.type, data.filename)" /> -->
    <ExportcsvexcelComponent :showModal="showExport" :downloaded="downloaded"
      @close="showExport = false, downloaded = false" @submit="(data) => exportData2(data.type, data.filename)" />
  </div>
</template>
<script setup>
import { inject, watch, ref, computed, provide, defineAsyncComponent, onBeforeMount } from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import NightPerWeekComponent from '@Components/NightPerWeekComponent.vue';
import HeadComponent from '@Components/layouts/HeadComponentTemp.vue';
import services from '@Services/index.js';
import csvXlsx from '@Services/csvXlsx.js';

const ExportcsvexcelComponent = defineAsyncComponent(() =>
  import('@Components/utils/ExportcsvexcelComponent.vue')
)


const show = ref(false);
const modalData = ref([]);
provide('modalData', modalData)
const freq = ref(null);
const selectedStation = inject('station');
const selectedCategory = inject('category');
const selectedDestination = inject('destination');
const order = ref('station.caption');
const sort = ref('ASC')
const period = inject('period');
const selectedYears = inject('selectedYears');
const periodObject = {
  'All': 'non',
  'Summer': 'ETE',
  'Winter': 'HIVER'
};
provide('nightData', modalData);
const headers = ref([
  { text: "Station", value: "stations", sortable: true },
  { text: "Destination", value: "destination"},
  { text: "Category", value: "category", sortable: true },
  { text: "Nights", value: "nights" },
  { text: "Occupancy rate", value: "occupancy_rate" },
  { text: "Period", value: "period"},
  { text: "Operation", value: "operation" },
]);

const serverItemsLength = ref(0);
const items = ref([]);
const loading = ref(false);
const query = ref('');

const serverOptions = ref({
  page: 1,
  rowsPerPage: 20,
});


/**
 * Searching
 */
const searchField = ["station", "category", "nationality", "period"];
const searchValue = ref('');

const IsValueOkay = (value) => (value == '' || value == 'non' || value == [] || value == null || value === undefined) ? false : true;
const loadFromServer = async (type, stations, category, years, period, page, limit, destination, order, sort) => {
  loading.value = true;
  let apiBase = '/frequentations';
  let apiParams = `freq=${type}&page=${page}&limit=${limit}`;
  
  if(IsValueOkay(category)){
      apiParams+=`&category=${category}`;
  }


  if(IsValueOkay(stations)){
      apiParams+=`&station=${station}`;
  }

  if(IsValueOkay(years)){
      apiParams+=`&years=${years}`;
  }

  if(IsValueOkay(period)){
      apiParams+=`&period=${period}`;
  }

  if(IsValueOkay(destination)){
      apiParams+=`&destination=${destination}`;
  }

  if(IsValueOkay(order)){
      apiParams+=`&order=${order}`;
  }

  if(IsValueOkay(sort)){
      apiParams+=`&sort=${sort}`;
  }

  const api = apiBase+ '?' + apiParams;

  query.value = 'frequentations?freq=' + type + '&station=' + stations + '&category=' + category + '&year=' + years + '&period=' + period;
  const response = await new Promise((resolve, reject) => {
    services.get_Record(api, (response) => {
      resolve(response)
    });
  });

  if (response.status == 200) {
    items.value = response.data['data'];
    serverItemsLength.value = response.data["length"];
    loading.value = false;
  }
};


onBeforeMount(() => {
  const { page, rowsPerPage } = serverOptions.value;
  loadFromServer('global', [], [],[], '', page, rowsPerPage, [], order.value, sort.value);
});


const arrayToString = (data) => {
  if (Array.isArray(data)) {
    const result = data.join('$');
    return result;
  }
}

const nightPerWeek = async(item)=>{
   const response = await new Promise((resolve, reject) => {
    services.get_Record(`/frequentations/weeks?station=${item.station_code}&category=${item.category}&period=${item.period}`, (response) => {
      resolve(response)
    });
  });

  if (response.status == 200) {
    modalData.value = response.data;
    freq.value = item;
    show.value = true;
  }
}

watch([serverOptions, period, selectedStation, selectedYears, selectedCategory, selectedDestination], () => {
  const station = IsValueOkay(selectedStation.value) ? arrayToString(selectedStation.value) : 'non';
  const category = IsValueOkay(selectedCategory.value) ? arrayToString(selectedCategory.value) : 'non';
  const years = IsValueOkay(selectedYears.value) ? arrayToString(selectedYears.value) : 'non';
  const destination = IsValueOkay(selectedDestination)? arrayToString(selectedDestination.value): 'non';

  const { page, rowsPerPage, sortBy, sortType } = serverOptions.value;
  if(sortBy == 'stations') order.value ='station.caption';
  if(sortBy == 'category') order.value ='category.code';
  sort.value = (sortType !== undefined)? sortType.toUpperCase():'';

  loadFromServer('global', station, category, years,period.value, page, rowsPerPage, destination, order.value, sort.value);
});

/**
 * Filter
 */

const occupancyRateCriteria = ref([0, 100]);

const formatNumber = (value) => {
  if (value == undefined || value == null) value = 0;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const perWeek = (frequentation) => {
  show.value = true;
  modalData.value = ('nights_by_week' in frequentation) ? frequentation.nights_by_week : [];
  freq.value = frequentation;
}

//Export data
const showExport = ref(false);
const downloaded = ref(false);
const exportData = (selector, type, filename) => {
  csvXlsx.exportData(selector, type, filename);
  downloaded.value = true;
};

const exportData2 = (type, filename) => {
  csvXlsx.exportData2(type, filename, query.value, serverItemsLength.value,
    ['Stations', 'Category', 'Nights', 'Occupancy rate', 'Period'])
  downloaded.value = true;
};

</script>
    
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.table__head {
  display: flex;
  justify-content: space-between;
}

.table__head button {
  background-color: var(--color-primary);
  color: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  font-size: 14px;
  font-weight: 500;
  padding: 0px 10px;
  border-radius: 5px;
}

input {
  width: 100%;
  border: 1px solid var(--light-color-bg2);
  border-radius: 3px;
  padding: 2px;
  caret-color: var(--light-color-bg2);
  font-weight: 500 !important;
  color: var(--color-bg1);
}

.filter-column {
  display: flex;
  align-items: center;
  justify-items: center;
  position: relative;
}

.filter-icon {
  cursor: pointer;
  display: inline-block;
  width: 15px !important;
  height: 15px !important;
  margin-right: 4px;
}

.filter-menu {
  padding: 15px 30px;
  z-index: 1;
  position: absolute;
  top: 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

.filter-night-menu {
  width: 350px;
}

.filter-fill-rate-menu {
  width: 200px;
}

.slider {
  margin-top: 36px;
}

.favouriteSport-selector {
  width: 100%;
}

.slider-demo-block {
  /* display: flex;
      align-items: center; */
  padding: 15px auto;
}

.slider-demo-block .el-slider {
  /* margin-top: 0;
      margin-left: 12px; */
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal__close i {
  position: relative;
  top: -20px;
  right: -5px;
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}

.modal__close i:hover {
  transform: rotate(360deg);
}

.modal__container {
  margin: 30px auto;
}

.table__modal {
  overflow-y: auto;
  height: 90%;
}

.search__input {
  padding-right: 10px;
}

.search__input input {
  width: 250px;
}

.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #e7ecf3;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: white;
  --easy-table-header-background-color: var(--color-bg);

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: var(--color-bg);
  --easy-table-body-row-background-color: white;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 13px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: var(--color-bg);
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 13px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}
</style>