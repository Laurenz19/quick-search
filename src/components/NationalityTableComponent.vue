<template>
<div>
 <div class="relative search__input mt-5">
   <!--<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
     <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
       <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
     </svg>
   </div>-->
   <div class="table__head">
    <!-- <input type="search" v-model="searchValue" id="default-search" class="block p-1  m-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search" required>-->
    <div></div>
     <button class="btn" @click="showExport=true">
       <i class="uil uil-file-download"></i>
       Export
     </button>
   </div>
   </div>
   <EasyDataTable
       class="mt-5"
       v-model:server-options="serverOptions"
       :headers="headers"
       :items="items"
       :server-items-length="serverItemsLength"
       :loading="loading"
       buttons-pagination
       theme-color="#6c63ff"
       table-class-name="customize-table"
    >
     <template #item-nationality="item">
       <span v-if="item.country=='Autre Europe' || item.country=='Autres Mondes'"> {{ item.nationality }}</span>
       <span v-else>{{ item.nationality }} <span :class="`fi fi-${item.nationality.toLowerCase()} fis`"></span></span>
     </template>
     <template #item-quantity="item">
       <span class="bg-green-100 text-green-800 rounded text-md font-medium mr-2 px-2.5 py-0.5">{{ formatNumber(item.quantity) || 0 }}</span>
     </template>
     <template #item-period="item">
       <span :class="['text-md font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700  border', item.period.includes('ETE')?'bg-yellow-100 text-yellow-800 dark:text-yellow-300 border-yellow-300':'bg-blue-100 text-blue-800 dark:text-blue-400 border-blue-400']"> {{ item.period }}</span>
     </template>
     <template #item-operation="item">
         <div class="operation-wrapper">
           <button v-if="item.nationality_by_week.length>0" @click="perWeek(item)">show</button>
         </div>
     </template>
   </EasyDataTable>
   <ModalComponent :showModal="show" @close="show=false" :height="85" :width="70">
       <template #content>
         <div class="modal__close">
           <i class="uil uil-times-circle mb-8"  @click="show = false"></i>
         </div>
         <div class="modal__header">
           <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Nationality per week</h3>
         </div>
         <div class="station__name">
           <ul>
               <li><span class="label">Station: </span> <span>{{ freq.stations }}</span></li>
               <li><span class="label">Category: </span> <span>{{ freq.category }}</span></li>
               <li><span class="label">Nationality: </span> <span>{{ freq.nationality }}</span></li>
           </ul>
         </div>
         <div class="relative overflow-x-auto table__modal mt-4">
           <NationalityPerWeekComponent/>
         </div>
       </template>                        
   </ModalComponent>
   <ExportcsvexcelComponent 
     :showModal="showExport" 
     :downloaded="downloaded"
     @close="showExport = false, downloaded = false"
     @submit="(data)=>exportData('table', data.type, data.filename)"
   />
</div>
</template>
<script setup>
import { inject, watch, ref, provide, computed, defineAsyncComponent, onBeforeMount } from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import NationalityPerWeekComponent from '@Components/NationalityPerWeekComponent.vue';
import moment from 'moment';
import csvXlsx from '@Services/csvXlsx.js';
import services from '@Services/index.js';

const ExportcsvexcelComponent = defineAsyncComponent(()=>
   import('@Components/utils/ExportcsvexcelComponent.vue')
)

const freqNationality = inject('freqNationality');
let data = ref(freqNationality.value);
const checkedStation = inject('checkedStation');
const checkedNationality = inject('checkedNationality');
const selectedCategory = inject('selectedCategory');
const selectedPeriod = inject('selectedPeriod');


const selectedYears = inject('selectedYears');

const year = inject('year');
const periodObject = {
       'All': 'non',
       'Summer': 'ETE',
       'Winter': 'HIVER'
};
const showExport = ref(false)
const freq = ref(null);
const show = ref(false);
const modalData = ref([]);
provide('modalData', modalData);
const downloaded = ref(false)

const headers = ref([
       { text: "Station", value: "stations" },
       { text: "Category", value: "category"},
       { text: "Nationality", value: "nationality"},
       { text: "Quantity", value: "quantity"},
       { text: "Period", value: "period"},
       { text: "Operation", value: "operation"},
]);

const items = ref([]);
const loading = ref(false);
const serverItemsLength = ref(0);
const serverOptions = ref({
  page: 1,
  rowsPerPage: 20,
});

 const filterOptions = computed(() => {
   const filterOptionsArray= [];

   filterOptionsArray.push({
     field: 'quantity',
     comparison: 'between',
     criteria: quantityCriteria.value,
   });
   
   return filterOptionsArray;
 });

watch(serverOptions, ()=>{
  console.log(serverOptions.value)
})

const formatNumber = (value) => {
     if(value == undefined || value == null) value = 0;
     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const perWeek = (frequentation)=>{
   show.value = true;
   frequentation.nationality_by_week.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
   modalData.value = frequentation.nationality_by_week;
   freq.value= frequentation;
}

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined)?false:true;

const loadFromServer = async (nationality, stations, category, years, period, page, limit) => {
      loading.value = true;
      console.log('proportions/nationalities?station='+ stations + '&category=' + category + '&nationality=' + nationality + '&year=' + years + '&period=' + period + '&page=' + page + '&limit=' + limit + '')
      const response = await new Promise((resolve, reject) => {
          services.get_Record('proportions/nationalities?station='+ stations + '&category=' + category + '&nationality=' + nationality + '&year=' + years + '&period=' + period + '&page=' + page + '&limit=' + limit + '', (response) => {
                  resolve(response)
          });
      });

      if(response.status==200){
        items.value= response.data['data'];
        serverItemsLength.value = response.data["totalPages"] * response.data["length"] - 1;
        loading.value = false;
      }
};

onBeforeMount(()=>{
  const {page, rowsPerPage} = serverOptions.value;
  loadFromServer('non','non', 'non', 'non', 'non', page, rowsPerPage);
});

const arrayToString = (data)=>{
  if (Array.isArray(data)) {
    const result = data.join('$');
    return result;
  }
}

const formatData = (data, property)=>{
  let result = [];
  data.forEach(item=>{
    result.push(item[property])
  })
  return result;
}

watch([serverOptions, checkedStation, checkedNationality, selectedCategory, selectedPeriod, selectedYears], ()=>{
 const stations = (checkedStation.value.length>0)?arrayToString(formatData(checkedStation.value, 'code')):'non'; 
 const years = (selectedYears.value.length>0)?arrayToString(selectedYears.value):'non';
 const nationalities = (checkedNationality.value.length>0)?arrayToString(formatData(checkedNationality.value, 'iso_code')):'non'; 
 const category = IsValueOkay(selectedCategory.value)?selectedCategory.value['code']:'non'; 
 const {page, rowsPerPage} = serverOptions.value;
 console.log(checkedStation.value)
 loadFromServer(nationalities, stations, category, years, periodObject[selectedPeriod.value], page, rowsPerPage);

});

const exportData = (selector, type, filename)=>{
 csvXlsx.exportData(selector, type, filename);
 downloaded.value = true;
};

</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.table__head{
 display: flex;
 justify-content: space-between;
}

.table__head button{
 background-color: var(--color-primary);
 color: white;
 box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
 font-size: 14px;
 font-weight: 500;
 padding: 0px 10px;
 border-radius: 5px;
}

.label{
  color: var(--color-primary);
}

span{
   font-size: 14px;
   color: var(--color-bg1);
}

input{
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

.filter-fill-rate-menu{
 width:200px;
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

.modal__header{
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.modal__close i{
  position: relative;
  top: -20px; 
  right: -5px;
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}

.modal__close i:hover{
   transform: rotate(360deg);
}

.modal__container{
   margin: 30px auto;
}

.table__modal{
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