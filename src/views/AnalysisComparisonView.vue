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
      	<NationalityFilter :data="allData" 
        @searchData="(filter)=> runSearch(filter)"
        @export="showExport = true"
        />
  		<div class="relative shadow-md sm:rounded-lg mt-10">
          <el-skeleton :rows="5" animated v-if="loading==true"/>
          <DataTableComponent :items="allData.items" :data="allData" :generateHeaders="true" v-if="loading!==true"/> 
  		</div>
       <ExportcsvexcelComponent :customisable="false" :showModal="showExport" :downloaded="downloaded"
      @close="showExport = false, downloaded = false" @submit="(data) => exportAnalysis(data.type, allData)" />
       </div>
</template>
<script setup>
import { onBeforeMount, ref, computed, watch, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from '@Stores/index.js';
import {useUserStore } from '@Stores/user.js';
import HeadComponent from '@Components/layouts/HeadComponentTemp.vue';
import config from '../pageConfig.js';
import NationalityFilter from '@Components/utils/NationalityFilterComponent.vue'
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import csvXlsx from '@Services/csvXlsx.js';
import services from '@Services/index.js';
import { useStationsStore } from '@Stores/stations.js';
import { useCategoriesStore } from '@Stores/categories.js';
import { useNationalitiesStore } from '@Stores/nationalities.js';
import { useDestinationsStore } from '@Stores/destination.js';
import moment from 'moment';
import { ElSkeleton } from 'element-plus';
import { ElMessage } from 'element-plus';

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
    secondTitle: 'Analysis and Comparison',
    path: '/analysis-page',
    icon: 'uil-chart-line',
})



const loading = ref(false)
const route = useRoute();
const router = useRouter();
const filterRequest = ref({
	category: ['FREQ GLOBALE'],
  station: [],
  massifs: [],
  panels: [],
  vallees: [],
  regions: [],
  nationalities: [],
  selectedElement: 'occupancy_rate',
  month: [],
  weekFrom: '',
  weekTo: '',
  result: [],
  years: [],
  season: [],
  holidays:[],
  destinations: []
})
const selectedCategory = ref('');
const items = ref({
	"data": {},
	"categories": [],
	"nationalities": [],
	"stations": [],
	"period": [],
  "destinations": [],
  "season":[]
});

const headers = ref([]);

const allData = ref({ 
  items: [],
  categories: [],
  nationalities: [],
  stations: [],
  months: [],
  destinations: [],
  season:[]
});

const formatNumber = (value) => {
  if (value == undefined || value == null) value = 0;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const uppercase = (value) => {
  return value.toUpperCase();
};

const areArraysEqual=(arr1, arr2) =>{
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((element, index) => element === arr2[index]);
}

/**
 *  This code needs refactorisation. The comment bellow is 
 *  an example of the refactor
 *  This Function is used to loop the api result to show the 
 *  data on datatable.
 */

const transformData = (originalData) => {
  let transformedItems = [];
  const infos = ['massif','vallee','region','panel']

  const getInfoValue = (data, info)=>{
    if(Array.isArray(data[info])){
      return data[info].join(', ')
    }
    return data[info]?data[info]:''
  }

  if(filterRequest.value && filterRequest.value.selectedElement == 'nationality'){
      if(originalData.stations.length>0){
        for (const station in originalData.data) {
            for (const category in originalData.data[station]) {
              if(infos.includes(category) && IsValueOkay(originalData[category])){
                transformedItems = transformedItems.map((item)=>{
                  if(!item[category]) return {...item, [category]: getInfoValue(originalData.data[station], category)}
                  return item;
                })
              }else if(!infos.includes(category)){
                for (const nationality in originalData.data[station][category]) {
                  let item = {
                    category: category,
                    station: station,
                    nationality:nationality,
                    max:0
                  }

                  for (const season in originalData.data[station][category][nationality]) {
                          if(!areArraysEqual(originalData.season,originalData.period)){
                            item.season = season
                          }

                          if(originalData.categories.length == 0){
                            item.nationality = item.category
                            delete item.category
                          }

                       for (const month of originalData.period) {
                          item[month] =
                            originalData.data[station][category][nationality][season][month] || 0;
                            if(item.max <=item[month]) item.max = item[month]
                        }
                  }
                  transformedItems.push(item);
                }
              }
        }
      }
    }

    if(originalData.destinations.length>0){
        for (const destination in originalData.data) {
            for (const category in originalData.data[destination]) {
              if(infos.includes(category) && IsValueOkay(originalData[category])){
                transformedItems = transformedItems.map((item)=>{
                  if(!item[category]) return {...item, [category]: getInfoValue(originalData.data[destination], category)}
                  return item;
                })
              }else if(!infos.includes(category)){
                for (const nationality in originalData.data[destination][category]) {
                    let item = {
                      category: category,
                      destination: destination,
                      nationality:nationality,
                      max:0
                    }
                    for (const season in originalData.data[destination][category][nationality]) {
                          if(!areArraysEqual(originalData.season,originalData.period)){
                            item.season = season
                          }

                          if(originalData.categories.length == 0){
                            item.nationality = item.category
                            delete item.category
                          }

                       for (const month of originalData.period) {
                          item[month] = originalData.data[destination][category][nationality][season][month] || 0;
                          if(item.max <=item[month]) item.max = item[month]
                        }
                    }
                  transformedItems.push(item);
                }
              }
            }
        }
    }
  }else{
    if(originalData.stations.length>0){
      for (const station in originalData.data) {
        for (const category in originalData.data[station]) {
          
          let item = {
            category: category,
            station: station,
            max:0
          }

          if(infos.includes(category) && IsValueOkay(originalData[category])){
                transformedItems = transformedItems.map((item)=>{
                  if(!item[category]) return {...item, [category]: getInfoValue(originalData.data[station], category)};
                  return item;
                })
          }else if(!infos.includes(category)){
            for (const season in originalData.data[station][category]) {
                if(!areArraysEqual(originalData.season,originalData.period)){
                  item.season = season
                }

                if(originalData.categories.length == 0){
                  item.season = item.category
                  delete item.category
                }
                
                for (const month in originalData.data[station][category][season]) {
                  item[month] = originalData.data[station][category][season][month] || 0;
                  if(item.max <=item[month]) item.max = item[month]
                }
            }
            transformedItems.push(item);
          }
        }
      }
    }

    if(originalData.destinations.length>0){
      for (const destinations in originalData.data) {
        for (const category in originalData.data[destination]) {
          let item = {
            category: category,
            destination: destination,
            max:0
          }
         
          if(infos.includes(category) && IsValueOkay(originalData[category])){
                transformedItems = transformedItems.map((item)=>{
                  if(!item[category]) return {...item, [category]: getInfoValue(originalData.data[station], category)};
                  return item;
                })
          }else if(!infos.includes(category)){
            for (const season in originalData.data[destination][category]) {
            
                if(!areArraysEqual(originalData.season,originalData.period)){
                  item.season = season
                }

                if(originalData.categories.length == 0){
                  item.season = item.category
                  delete item.category
                }

                for (const month of originalData.period) {
                  item[month] = originalData.data[destination][category][season][month] || 0;
                  if(item.max <=item[month]) item.max = item[month]
                }
            }
            transformedItems.push(item);
          }
        }
      }
    }
  }

  loading.value = false;
  return {
    items: transformedItems,
    categories: originalData.categories,
    nationalities: originalData.nationalities !== undefined?originalData.nationalities:[],
    stations: originalData.stations,
    destinations: originalData.destinations,
    months: originalData.period,
    season: originalData.season,
    massifs: originalData.massif,
    panels: originalData.panel,
    vallees: originalData.vallee,
    regions: originalData.region,
    max: originalData.max
  };
};

const breadcrumbData = computed(()=>{
    return [
        {
            title: `analysis & comparison`,
            path: `${ route.path }`,
            isCurrent: true,
        },
    ]
})

const arrayToString = (data)=>{
  if (Array.isArray(data)) {
    const result = data.join('$');
    return result;
  }
}

const runSearch = (filter)=>{
  filterRequest.value = filter
  loading.value = true;
  loadResult(
      filter.selectedElement,
      filter.years, 
      filter.station,
      filter.destinations, 
      filter.category, 
      filter.month,
      filter.massifs,
      filter.panels,
      filter.vallees,
      filter.regions,
      filter.weekFrom,
      filter.weekTo,
      filter.season,
      filter.holidays,
      filter.result,
      filter.nationalities,
      filter.departments, 
      filter.zones,
      userStore.user.id
  );
}

const transformToValues = (data)=> {
    if (Array.isArray(data)) {
        return data;
    } else if (typeof data === 'object' && data !== null) {
        return Object.values(data);
    } else {
        return [];
    }
}

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined || value == [])?false:true;
const loadResult = async (rate, years,stations,destinations,category,month, massifs, panels, vallees, regions, weekFrom, weekTo, season, holidays, result,nationality, departments, zones, user)=>{
  category = arrayToString(category);
  years.sort(function(a, b) {
        return a - b;
  });
  years = arrayToString(years)
  let apiBase = '/comparaison/analysis';
  let apiParams = `rate=${rate}&year=${years}&category=${category}&user=${user}`;

  if (IsValueOkay(month)) {
    month = arrayToString(month);
    apiParams += `&month=${month}&result=month`;
  }

  if (IsValueOkay(weekFrom) && IsValueOkay(weekTo)) {
    weekFrom = moment(weekFrom).format('YYYY-MM-DD')
    weekTo = moment(weekTo).format('YYYY-MM-DD')
    apiParams += `&week_from=${weekFrom}&week_to=${weekTo}&result=week`;
  }

  if (IsValueOkay(season)) {
    season = arrayToString(season);
    apiParams += `&season=${season}`;

     if (IsValueOkay(result)) {
        result = arrayToString(result);
        apiParams += `&result=${result}`;
     }else{
        apiParams += `&result=season`;
     }
  }

  if (IsValueOkay(holidays)) {
    holidays = arrayToString(holidays);
    apiParams += `&vacance=${holidays}&result=vacance`;
  }


  if(!IsValueOkay(season) && !IsValueOkay(weekFrom) && !IsValueOkay(weekTo) && !IsValueOkay(month) && !IsValueOkay(holidays)){
    result = arrayToString(result);
    apiParams += `&result=year`;
  }


  if (IsValueOkay(nationality)) {
    nationality = arrayToString(nationality);
    apiParams += `&nationality=${nationality}`;
  }else if(rate == 'nationality' && !IsValueOkay(nationality)){
    apiParams += `&nationality=all`;
  }

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


  if (IsValueOkay(departments)) {
    departments = arrayToString(departments);
    // apiParams += `&destination=${destinations}`;
  }

  if (IsValueOkay(zones)) {
    zones = arrayToString(zones);
    // apiParams += `&destination=${destinations}`;
  }

  const api = `${apiBase}?${apiParams}`;
  console.log(api)
  const response = await new Promise((resolve, reject) => {
      services.get_Record(api, (response) => {
        resolve(response);
      });
  });
  console.log(response)

  if(response.status==200){
      const data = {
        ...response.data, 
        period: transformToValues(response.data.period),
        stations: transformToValues(response.data.stations),
        massif: massifs,
        panel: panels,
        vallee: vallees,
        region: regions
      }

      allData.value = transformData(data);
  }else if(response.status == 500){
    ElMessage({
        message: 'Failed to load resource: the server',
        type: 'error',
    })
    loading.value = false;
  }
};

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
      await destinationsStore.fetchAll('nationality', destinations =>{
        console.log('destinations', destinations);
      }) 
    }
});

//Export data
const showExport = ref(false);
const downloaded = ref(false);
const exportData = (selector, type, filename) => {
  csvXlsx.exportData(selector, type, filename);
  downloaded.value = true;
};

const exportAnalysis = (type, data) => {
  let headers = [];
  let items = [];

  let filename = `data_${filterRequest.value.selectedElement}_${moment()}`
  if(data.stations.length>0) headers.push('Station')
  if(data.destinations.length>0) headers.push('Destination')
  if(data.massifs.length>0) headers.push('Massif')
  if(data.panels.length>0) headers.push('¨Pannel')
  if(data.regions.length>0) headers.push('Region')
  if(data.vallees.length>0) headers.push('Vallee')
  headers.push('Category')
  if(data.nationalities.length>0) headers.push('Nationality')
  if(data.season.length>0) headers.push('Season')
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

.table-container {
  overflow-x: auto;
  margin: 40px 20px;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

th, td {
  padding: 12px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
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
/* Ajoutez des media queries pour rendre le tableau responsive */
@media (max-width: 600px) {
  th, td {
    font-size: 12px;
    padding: 8px;
  }
}

</style>