<template>
<div class="breadcrumb__container">
        <BreadcrumbComponent :data="breadcrumbData"/>
</div>
<div class="container app__container">
    <div class="app__filter">
        <div class="result_type__filter">
                    <DropdownComponent :is-search="false" :data="resultType" :showTitle="false" :default="'Global'" :isClearable="false"  
                    @submit="(type)=>{
                        selectedType = type
                    }"
                    />
                </div>
        <DataFilter @reset="resetData" @searchData="(filter)=>{
      		filterRequest = filter
      	}"/>
        </div>
        <div class="result__content">
            <RouterView></RouterView>
        </div>
</div>
</template>
<script setup>
import { ref, watch, provide, computed, onBeforeMount } from 'vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import { useRoute, useRouter } from "vue-router";
import { useStationsStore } from '@Stores/stations.js';
import { useCategoriesStore } from '@Stores/categories.js';
import DataFilter from '@Components/utils/DataFilterComponent.vue'
import { useAppStore } from '@Stores/index.js';
import config from '../pageConfig.js';
import services from '@Services/index.js';
import { useNationalitiesStore } from '@Stores/nationalities.js';
import { useDestinationsStore } from '@Stores/destination.js';

const route = useRoute();
const router = useRouter();
const breadcrumbData = computed(()=>{
    return [
        {
            title: `${config.pages[route.name].secondTitle}`,
            path: `${ route.path }`,
            isCurrent: true,
        },
    ]
})

const appStore = useAppStore();
const categoriesStore = useCategoriesStore();
const stationsStore = useStationsStore();
const nationalitiesStore = useNationalitiesStore();
const destinationsStore = useDestinationsStore();
const globalResult= ref([]);
const _globalResult= ref([]);
const nightResult = ref([]);
const _nightStockResult = ref([]);
const stocksResult = ref([]);
const year = ref('');
const dateStart = ref(null);
const dateEnd = ref(null);
const selectedStation = ref(null);
const selectedCategory = ref(null);
const selectedDestination = ref(null);
const resultType = ref([
    'Global',
    // 'Occupancy',
    'Night',
    'Stocks'
]);
const selectedType = ref(route.name);
const periods = ref([
    'All', 'Summer', 'Winter'
]);

const selectedPeriod = ref(null);
const disabled = ref(true);
const handleDate = () => {
    disabled.value = dateStart.value==null?true:false;
    dateEnd.value = dateStart.value==null?null:'';
}

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
/***
 * Provide data to all descendant components 
 */
provide('year', year);
provide('dateStart', dateStart);
provide('dateEnd', dateEnd);
provide('period', selectedPeriod);
provide('category', selectedCategory);
provide('station', selectedStation);
provide('destination', selectedDestination);
provide('type', selectedType);
provide('nightResult', nightResult);
provide('stocksResult', stocksResult);
provide('nightStockResult', _nightStockResult);
provide('globalResult', globalResult);
provide('_globalResult', _globalResult);

const selectedYears = ref([]);
provide('selectedYears' ,selectedYears ) ;

router.beforeEach((to, from, next) => {
      selectedYears.value = [];
      next();
});

const currentYear = new Date().getFullYear();
const years = ref(Array.from({ length: 8 }, (_, i) => ({
  value: (currentYear - 5 + i).toString(),
  label: (currentYear - 5 + i).toString(),
})));


const filterRequest = ref({
	category: '',
	station: '',
    period:'',
    year: '',
})

watch(filterRequest, ()=>{
    selectedStation.value =filterRequest.value.station;
    selectedYears.value = filterRequest.value.year;
    selectedPeriod.value = filterRequest.value.period;
    selectedCategory.value = filterRequest.value.category;
    selectedDestination.value = filterRequest.value.destination;
})

watch(selectedType, ()=>{
    router.push({name: selectedType.value})
})

const getGlobalFrequentation = async (next)=>{
    await services.globalRequest('non', 'non', 'non', (response)=>{
        if(response.status == 200){
            globalResult.value = response.data.frequentations;
            _globalResult.value = response.data.frequentations;
        }
    });
    next();
}

const getFrequentation = async (next)=>{
    await services.specificRequest('non', 'non', 'non', 'non', (response)=>{
        if(response.status == 200){
            nightResult.value = response.data.frequentations;
            _nightStockResult.value = response.data.frequentations;
            stocksResult.value = response.data.frequentations;
        }
    });
    next();
}

const resetData = ()=>{
    selectedStation.value = [];
    selectedYears.value = [];
    selectedPeriod.value = '';
    selectedCategory.value = [];
    selectedDestination.value = [];
}

onBeforeMount(async ()=>{
    if(appStore.isLoading == false) appStore.isLoading = true;
    appStore.isLoading = false;
    if(stationsStore.stations.length == 0){
         if(destinationsStore.destinations.length == 0){
              await destinationsStore.fetchAll('night', destinations =>{
                console.log('destinations', destinations);
              }) 
            }
        await stationsStore.fetchAll((stations)=>{
          console.log('stations', stations);
        })
      }

      if(categoriesStore.categories.length == 0){
        await categoriesStore.fetchAll( categories =>{
          console.log('categories', categories);
        })
      }
      
      if(nationalitiesStore.nationalities.length == 0){
        await nationalitiesStore.fetchAll( nationalities =>{
          console.log('nationalities', nationalities);
        }) 
      } 
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.not__found{
    display: flex;
    justify-content: center;
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
}
.station__name{
    font-size: 15px;
    font-weight: 500;
    color: var(--color-primary);
}
.app__container{
    height: inherit;
    width: var(--container-width-lg);
    margin: 50px auto 0px auto;
    padding: 0;
    min-height: 50rem;
}
.app__container .app__filter{
   margin: 25px auto;
}

.app__filter .filter__content{
    border: 1px solid var(--light-color-bg1);
    width: inherit;
    border-radius: 5px;
    display: flex;
    align-items:center;
}

.filter__content > div{
    margin: 5px;
    flex-grow: 1;
}

.filter__content .category__filter{
    flex-basis:22rem;
}
.app__container .result__content{
    border: 1px solid var(--light-color-bg1);
}

.result__message img{
    width: 20%;
    height: 20%;
    margin: 15px auto;
}

.result__message div{
    display: flex;
    justify-content: center;
    color: gray;
}

.app__loader{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
}

.nationality{
    text-align: center;
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

@media screen and (max-width:1024px) {
    .app__container{
        position: relative;
        top: 8rem;
    }
}
</style>