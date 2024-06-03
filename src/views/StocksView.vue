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
      :filter-options="filterOptions"
      :loading="loading"
      v-model:server-options="serverOptions" 
      :server-items-length="serverItemsLength" 
      :search-field="searchField"
      :search-value="searchValue" 
      buttons-pagination 
      theme-color="#6c63ff" 
      table-class-name="customize-table">
      <template #item-beds="item">
        <span class="bg-green-100 text-green-800 rounded text-md font-medium mr-2 px-2.5 py-0.5">{{
          formatNumber(item.beds) || 0 }}</span>
      </template>
      <template #item-destination="item">
       {{ item.destination
          || "-" }}
      </template>
      <template #item-lots="item">
        <span class="bg-green-100 text-green-800 rounded text-md font-medium mr-2 px-2.5 py-0.5">{{
          formatNumber(item.lots) || 0 }}</span>
      </template>
      <template #item-period="item">
        <span
          :class="['text-md font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700  border', item.period.includes('ETE') ? 'bg-yellow-100 text-yellow-800 dark:text-yellow-300 border-yellow-300' : 'bg-blue-100 text-blue-800 dark:text-blue-400 border-blue-400']">
          {{ item.period }}</span>
      </template>
    </EasyDataTable>
    <!-- <ExportcsvexcelComponent :showModal="showExport" :downloaded="downloaded"
      @close="showExport = false, downloaded = false" @submit="(data) => exportData('table', data.type, data.filename)" /> -->
    <ExportcsvexcelComponent :showModal="showExport" :downloaded="downloaded"
      @close="showExport = false, downloaded = false" @submit="(data) => exportData2(data.type, data.filename)" />
  </div>
</template>
<script setup>
import { inject, watch, ref, computed, onBeforeMount, provide, defineAsyncComponent } from 'vue';
import services from '@Services/index.js';
import moment from 'moment';
import csvXlsx from '@Services/csvXlsx.js';

const ExportcsvexcelComponent = defineAsyncComponent(() =>
  import('@Components/utils/ExportcsvexcelComponent.vue')
)
const _nightStockResult = inject('nightStockResult');
const stocksResult = inject('stocksResult');
const show = ref(false);
const modalData = ref([]);
const freq = ref(null);
const selectedStation = inject('station');
const selectedCategory = inject('category');
const selectedType = inject('type');
const year = inject('year');
const period = inject('period');
const selectedYears = inject('selectedYears');
const selectedDestination = inject('destination');
const order = ref('station.caption');
const sort = ref('ASC');
const periodObject = {
  'All': 'non',
  'Summer': 'ETE',
  'Winter': 'HIVER'
};
provide('nightData', modalData);
const headers = ref([
  { text: "Station", value: "stations", sortable: true  },
  { text: "Destination", value: "destination"},
  { text: "Category", value: "category", sortable: true  },
  { text: "Beds", value: "beds" },
  { text: "Lots", value: "lots" },
  { text: "Period", value: "period" },
]);


const items = ref([]);
const loading = ref(false);
const query = ref('');

const serverOptions = ref({
  page: 1,
  rowsPerPage: 20,
});



/**
 * Export data
 */
const showExport = ref(false);
const downloaded = ref(false);
const exportData = (selector, type, filename) => {
  csvXlsx.exportData(selector, type, filename);
  downloaded.value = true;
};

const exportData2 = (type, filename) => {
  csvXlsx.exportData2(type, filename, query.value, serverItemsLength.value,
    ['Stations', 'Category', 'Beds', 'Lots', 'Period']);
  downloaded.value = true;
}

/**
 * Searching
 */
const searchField = ["stations", "category", "nationality", "period"];
const searchValue = ref('');

const serverItemsLength = ref(0);
// const loadFromServer = async (type, stations, category, years, period, page, limit) => {
//   loading.value = true;
//   query.value = 'frequentations?freq=' + type + '&station=' + stations + '&category=' + category + '&year=' + years + '&period=' + period;
//   const response = await new Promise((resolve, reject) => {
//     services.get_Record('frequentations?freq=' + type + '&station=' + stations + '&category=' + category + '&year=' + years + '&period=' + period + '&page=' + page + '&limit=' + limit + '', (response) => {
//       resolve(response)
//     });
//   });

//   if (response.status == 200) {
//     items.value = response.data['data'];
//     serverItemsLength.value = response.data["length"];
//     loading.value = false;
//   }
//   console.log(response)
// };

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

// const IsValueOkay = (value) => (value == '' || value == null || value == undefined) ? false : true;
// watch([serverOptions, period, selectedStation, selectedYears, selectedCategory], () => {
//   const station = IsValueOkay(selectedStation.value) ? arrayToString(selectedStation.value): 'non';
//   const category = IsValueOkay(selectedCategory.value) ? arrayToString(selectedCategory.value) : 'non';
//   const years = (selectedYears.value.length > 0) ? arrayToString(selectedYears.value) : 'non';
//   const { page, rowsPerPage } = serverOptions.value;
//   loadFromServer('stocks', station, category, years, period.value, page, rowsPerPage);
//   console.log(serverOptions.value)
// });
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

/**
 * Filter
 */

const filterOptions = computed(() => {
  const filterOptionsArray = [];

  return filterOptionsArray;
});

const nightStockFilterResult = (station, category, period, year) => {
  let frequentations = [..._nightStockResult.value];

  if (station !== 'non') {
    frequentations = frequentations.filter((frequentation) => frequentation.station_caption == station);
  }

  if (period !== 'non') {
    frequentations = frequentations.filter((frequentation) => {
      return frequentation.caption.includes(period) == true;
    });
  }

  if (selectedYears.value.length > 0) {
    let result = [];
    console.log("tonga ato izy ");
    selectedYears.value.forEach(year => {
      result = [...result, ...frequentations.filter(item => item.caption.includes(year))];

    });
    frequentations = result;
  }

  if (category !== 'non') {
    frequentations = frequentations.filter((frequentation) => {
      return frequentation.category_code == category;
    });
  }
  stocksResult.value = (selectedType.value == 'Stocks') ? frequentations : _nightStockResult.value;
}

const formatNumber = (value) => {
  if (value == undefined || value == null) value = 0;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/*const IsValueOkay = (value)=> (value == '' || value == null || value == undefined)?false:true;
 
watch([selectedStation, selectedCategory, year, period,selectedYears], async ()=>{
    const station = IsValueOkay(selectedStation.value)?selectedStation.value['caption']:'non'; 
    const year_value = IsValueOkay(year.value)?moment(year.value).format('YYYY'):'non';
    const code = IsValueOkay(selectedCategory.value)?selectedCategory.value['code']:'non';
    nightStockFilterResult(station, code, periodObject[period.value], year_value);
});*/
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