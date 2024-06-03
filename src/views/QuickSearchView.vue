<template>
	<!-- <HeadComponent 
	:page="page">
	</HeadComponent> -->
	<div class="breadcrumb__container">
        <BreadcrumbComponent :data="breadcrumbData"/>
    </div>
    <div class="container app__container">
    	<div class="information">
          <img src="@Assets/images/info.png" alt="">
            <span>Please fill all the filters to see the result.</span>
          </div>
    	<AppFilter :data="allData" 
    	@searchData="(filter)=> runSearch(filter)"
    	@export="showExport = true"
      title="Quick search filter" 
    	/>
		<div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
      <el-skeleton :rows="5" animated v-if="loading==true"/>
      <DataTableComponent :items="allData.items" :data="allData" :generateHeaders="true" v-if="loading!==true"/>
	  </div>
	     <ExportcsvexcelComponent :customisable="false" :showModal="showExport" :downloaded="downloaded"
      @close="showExport = false, downloaded = false" @submit="(data) => exportAnalysis(data.type, allData)" />
	</div>
</template>
<script setup>
import { onBeforeMount, ref, computed, watch, defineAsyncComponent  } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from '@Stores/index.js';
import HeadComponent from '@Components/layouts/HeadComponentTemp.vue';
import config from '../pageConfig.js';
import AppFilter from '@Components/utils/AppFilterComponent.vue'
import AppTable from '@Components/utils/TableSearchComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import services from '@Services/index.js';
import csvXlsx from '@Services/csvXlsx.js';
import { useStationsStore } from '@Stores/stations.js';
import { useCategoriesStore } from '@Stores/categories.js';
import { useNationalitiesStore } from '@Stores/nationalities.js';
import SpinnerComponent from'@Components/utils/SpinnerComponent.vue';
import { useDestinationsStore } from '@Stores/destination.js';
import {useUserStore } from '@Stores/user.js';
import moment from 'moment';
import { ElSkeleton } from 'element-plus';

const ExportcsvexcelComponent = defineAsyncComponent(() =>
  import('@Components/utils/ExportcsvexcelComponent.vue')
)

const DataTableComponent = defineAsyncComponent(() =>
  import('@Components/utils/DataTableComponent.vue')
)

const appStore = useAppStore();
const userStore = useUserStore();
const categoriesStore = useCategoriesStore();
const stationsStore = useStationsStore();
const nationalitiesStore = useNationalitiesStore();
const destinationsStore = useDestinationsStore();
const page = ref({
	firstTitle: '',
    secondTitle: 'Quick search',
    path: '/explore-data',
    icon: 'uil-file-search-alt',
})
const route = useRoute();
const router = useRouter();
const filterRequest = ref({
	category: '',
	station: '',
	periods: '',
	type: '',
	destinations: ''
});

const items = ref({
  "data": {},
  "categories": [],
  "stations": [],
  "period": [],
  "destinations": []
})

const breadcrumbData = computed(()=>{
    return [
        {
            title: `quick search`,
            path: `${ route.path }`,
            isCurrent: true,
        },
    ]
});
const loading = ref(false)
// const allData = computed(()=>{
// 	console.log("items", items.value);
// 	return transformData(items.value);
// });

const allData = ref({
  items: [],
  categories: [],
  stations: [],
  months: [],
  destinations: []
})

const transformData = (originalData) => {
  console.log(originalData)
  const transformedItems = [];
  if(originalData.stations.length>0){
  	 for (const station in originalData.data) {
	    for (const category of originalData.categories) {
				const item = {
				station: station,
				category: category,
				};
	        for (const month of originalData.period) {
				console.log("originalData.period"  + originalData.period);
	          item[month] = originalData.data[station][category][month] || 0;
	        }
	        transformedItems.push(item);
	      }
	    }
  }

  if(originalData.destinations.length>0){
  	for (const destinations in originalData.data) {
	    for (const category of originalData.categories) {
				const item = {
				station: destinations,
				category: category,
				};
	        for (const month of originalData.period) {
				console.log("originalData.period"  + originalData.period);
	          item[month] = originalData.data[destinations][category][month] || 0;
	        }
	        transformedItems.push(item);
	      }
	    }
  }
  loading.value = false;
  
  return {
    items: transformedItems,
    categories: originalData.categories,
    stations: originalData.stations,
    months: originalData.period,
    destinations: originalData.destinations
  };
}

const runSearch = (filter)=>{
  filterRequest.value = filter
  loading.value = true;
  console.log("Filters ", filter)
  loadFromServer(
    filter.station, 
    filter.category, 
    filter.periods, 
    filter.type, 
    filter.destinations,
    filter.massifs,
    filter.panels,
    filter.vallees,
    filter.regions,
    userStore.user.id
  );
}

const arrayToString = (data)=>{
  if (Array.isArray(data)) {
    const result = data.join('$');
    return result;
  }
}

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined)?false:true;

const loadFromServer = async (stations, category, periods, type, destinations, massifs, panels, vallees, regions, user) => {
	  const fromDate = moment(periods[0]).format('YYYY-MM')
	  const toDate = moment(periods[1]).format('YYYY-MM')
	  category= arrayToString(category);
	  let apiBase = '/comparaison/occupancy_rate';
	  let apiParams = `rate=${type}&category=${category}&fromDate=${fromDate}&toDate=${toDate}&user=${user}`;
    //massif, panel, vallee, region
	   if (IsValueOkay(stations)) {
	      stations = arrayToString(stations);
	      apiParams += `&station=${stations}`;
	   }

     if (IsValueOkay(massifs)) {
        massifs = arrayToString(massifs);
        apiParams += `&massif=${massifs}`;
     }

     if (IsValueOkay(panels)) {
        panels = arrayToString(panels);
        apiParams += `&panel=${panels}`;
     }

     if (IsValueOkay(vallees)) {
        vallees = arrayToString(vallees);
        apiParams += `&vallee=${vallees}`;
     }

     if (IsValueOkay(regions)) {
        regions = arrayToString(regions);
        apiParams += `&region=${regions}`;
     }

	   if (IsValueOkay(destinations)) {
	      destinations = arrayToString(destinations);
	      apiParams += `&destination=${destinations}`;
	   }

	  const api = `${apiBase}?${apiParams}`;
	  console.log(api);

	  const response = await new Promise((resolve, reject) => {
          services.get_Record(api, (response) => {
                resolve(response)
          });
      }); 

    console.log(response)

      if(response.status==200){
      	items.value = response.data;
        allData.value = transformData(items.value);
      }
};

// watch(filterRequest, ()=>{
// 	console.log(filterRequest.value)
// 	const filter = filterRequest.value;
// 	loadFromServer(filter.station, filter.category, filter.periods, filter.type, filter.destinations);
// })

onBeforeMount(async ()=>{
    if(appStore.isLoading == false) appStore.isLoading = true;
    appStore.isLoading = false;

    if(stationsStore.stations.length == 0){
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
	
	if(destinationsStore.destinations.length == 0){
      await destinationsStore.fetchAll('night', destinations =>{
        console.log('destinations', destinations);
      })
    }
});

//Export data
const showExport = ref(false);
const downloaded = ref(false);
const exportAnalysis = (type, data) => {
  let headers = [];
  let items = [];

  let filename = `data_${filterRequest.value.type}_${moment()}`
  if(data.stations.length>0) headers.push('Station')
  if(data.destinations.length>0) headers.push('Destination')
  headers.push('Category')
  for (var i = 0; i < data.months.length; i++) {
    headers.push(data.months[i].replace('-', ' '))
  }

  csvXlsx.exportAnalysis(type, filename, data.items, headers)
  downloaded.value = true;
};
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.app__container{
    height: inherit;
    width: var(--container-width-lg);
    margin: 50px auto 0px auto;
    padding: 0;
    min-height: 50rem;
}

@media screen and (max-width:1024px) {
    .app__container{
        position: relative;
        top: 8rem;
    }
}

@media screen and (max-width:1024px) {
    .app__container{
        position: relative;
        top: 8rem;
    }
}

@media screen and (max-width:700px) {
    .retrieve__table {
	    display: flex;
	    flex-direction: column;
	}

	.retrieve__table thead,
	.retrieve__table tbody {
		display: flex;
	    flex-direction: row; 
	}

	.retrieve__table thead tr,
	.retrieve__table tbody tr {
		display: flex;
		flex-direction: column;
	}

}


.information img{
  width: 15px;
  height: 15px;
}

.information{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap:0.5rem;
  padding: 5px;
  font-size: 14px;
  font-weight: bold;
  color: grey;
}

</style>