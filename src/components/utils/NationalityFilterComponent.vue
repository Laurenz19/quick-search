<template>
	<div class="app__filter">
		 <button @click="$emit('export')" v-if="allData.items.length>0">
		    <i class="uil uil-file-download"></i>
          	Export
	     </button>
	   <!--   <button @click="openModal" v-if="areFilterNotEmpty">
		      <i class="uil uil-filter"></i>
		       Custom Filter
	     </button> -->
	     <button @click="openModalV2">
		     <i class="uil uil-filter"></i>
		     Filters
	     </button>
	</div>
	<ModalComponent 
	:showModal="show" 
	@close="show=false" 
	:height="80" 
	:width="modalWidth">
        <template #content>
            <div class="modal__close">
                <i class="uil uil-times-circle mb-8"  @click="show=false"></i>
            </div>
            <div class="modal__header">
                <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">Analysis & comparison filter</h4>
            </div>
            <form @submit.prevent="searchData" @keydown.enter.prevent="searchData" class="login__form">
            	<div>
				    <label for="destination" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Compared element <span>*</span>
				    </label>
				     <el-select-v2
				        id="destination"
					    v-model="filter.selectedElement"
					    :options="comparedElements"
					    placeholder="select element"
					    style="width: 100%"
					>
					    <template #default="{ item }">
					      <span style="margin-right: 8px">{{ item.label }}</span>
					    </template>
					</el-select-v2>
				 </div>
            	<div>
				    <label for="destination" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Destinations <span>*</span>
				    </label>
				     <el-select-v2
				        id="destination"
					    v-model="filter.destinations"
					    filterable
					    :options="destinations"
					    clearable
					    :disabled="filter.station.length>0"
					    placeholder="select destinations"
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="2"
					    style="width: 100%"
					>
					    <template #default="{ item }">
					      <span style="margin-right: 8px">{{ item.label }}</span>
					    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="station" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Stations <span>*</span>
					</label>
				     <el-select-v2
				        id="station"
					    v-model="filter.station"
					    filterable
					    :disabled="filter.destinations.length>0"
					    :options="stations"
					    clearable
					    placeholder="select stations"
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
					    :multiple-limit="5"
					    style="width: 100%"
					>
						    <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="massifs" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Massifs
					</label>
				     <el-select-v2
				        id="massifs"
					    v-model="filter.massifs"
					    filterable
					    :options="massifs"
					    clearable
					    placeholder="select massifs"
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
					    style="width: 100%"
					>
						    <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="panels" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Panels
					</label>
				     <el-select-v2
				        id="panels"
					    v-model="filter.panels"
					    filterable
					    :options="panels"
					    clearable
					    placeholder="select panels"
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
					    style="width: 100%"
					>
						    <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="vallees" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Vallees
					</label>
				     <el-select-v2
				        id="vallees"
					    v-model="filter.vallees"
					    filterable
					    :options="vallees"
					    clearable
					    placeholder="select vallees"
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
					    style="width: 100%"
					>
						    <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				  <div>
				    <label for="regions" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Regions
					</label>
				     <el-select-v2
				        id="regions"
					    v-model="filter.regions"
					    filterable
					    :options="regions"
					    clearable
					    placeholder="select regions"
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
					    style="width: 100%"
					>
						    <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="department" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Department
					</label>
					 <el-select-v2
					    id="department"
					    v-model="filter.department"
					    filterable
					    :options="departments"
					    placeholder="select departments"
					     style="width: 100%"
					    multiple
					  />
				 </div>
				 <div>
				    <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Categories <!-- <span>*</span> -->
					</label>
				     <el-select-v2
				     	id="category"
					    v-model="filter.category"
					    filterable
					    clearable
					    :options="categories"
					    placeholder="select category"
						multiple
						collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
					    :multiple-limit="5"
					    style="width: 100%"
					 >
					    <template #default="{ item }">
					      <span :style="{
						      'marginRight': '8px',
						      'fontSize': '15px'
					      }"
					  >{{ item.label }}</span>
					    </template>
				</el-select-v2>
				 </div>
				 <div v-if="filter.selectedElement == 'nationality'">
				    <label for="nationality" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Nationalities <!-- <span>*</span> -->
					</label>
				     <el-select-v2
				     		id="nationality"
						    v-model="filter.nationalities"
						    filterable
						    clearable
						    :options="nationalities"
						    placeholder="select nationalities"
						    multiple
						    :multiple-limit="5"
						    collapse-tags
						    collapse-tags-tooltip
						    :max-collapse-tags="4"
						    style="width: 100%"
						 >
						    <template #default="{ item }">
						     <span style="font-size: 15px" v-if="item.label=='Autre Europe' || item.label=='Autres Mondes'"> {{ item.label }}</span>
			       			 <span style="font-size: 15px" v-else><span :class="`fi fi-${item.value.toLowerCase()} fis`"></span> {{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="month" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Year <span>*</span>
					</label>
                    <el-select-v2
				        id="year"
					    v-model="filter.years"
					    filterable
					    clearable
					    :options="yearsArray"
					    placeholder="select years"
						multiple
						collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
					    style="width: 100%"
					 >
					     <template #default="{ item }">
					      <span style="margin-right: 8px">{{ item.label }}</span>
					    </template>
				    </el-select-v2>
                </div>
                <div>
				    <label for="seasons" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Season
					</label>
				     <el-select-v2
				        id="seasons"
					    v-model="filter.season"
					    :disabled="(filter.month.length>0 || filter.holidays.length>0 || IsValueOkay(filter.weekFrom) || IsValueOkay(filter.weekTo) || filter.zones.length>0)"
					    clearable
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="2"
					    :multiple-limit="2"
					    :options="seasons.global"
					    placeholder="select season"
					    style="width: 100%"
					 >
						     <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				  <div v-if="filter.season.length>0">
				    <label for="result" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Result type
					</label>
				     <el-select-v2
				        id="result"
					    v-model="filter.result"
					    clearable
					    multiple
					    collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="1"
					    :multiple-limit="1"
					    :options="resultTypes"
					    placeholder="choose the result type"
					    style="width: 100%"
					 >
						     <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="month" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Months
					</label>
				     <el-select-v2
				        id="month"
					    v-model="filter.month"
					    filterable
					    clearable
					    :disabled="(filter.season.length>0 || filter.holidays.length>0 || IsValueOkay(filter.weekFrom) || IsValueOkay(filter.weekTo) || filter.zones.length>0)"
					    :options="months"
					    placeholder="select months"
						multiple
						collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="12"
					    :multiple-limit="12"
					    style="width: 100%"
					 >
					     <template #default="{ item }">
					      <span style="margin-right: 8px">{{ item.label }}</span>
					    </template>
				</el-select-v2>
				 </div>
				 <div>
				    <label for="holidays" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Commercial Period
					</label>
				     <el-select-v2
				        id="holidays"
					    v-model="filter.holidays"
					    clearable
					    multiple
					    :disabled="(filter.season.length>0 || filter.month.length>0 || IsValueOkay(filter.weekFrom) || IsValueOkay(filter.weekTo) || filter.zones.length>0)"
					    filterable
						collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="5"
					    :multiple-limit="5"
					    :options="seasons.special"
					    placeholder="commercial period"
					    style="width: 100%"
					 >
						     <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				  <div>
				    <label for="zone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Zones
					</label>
				     <el-select-v2
				        id="zone"
					    v-model="filter.zones"
					    clearable
					    multiple
					    :disabled="(filter.season.length>0 || filter.month.length>0 || IsValueOkay(filter.weekFrom) || IsValueOkay(filter.weekTo) || filter.holidays.length>0)"
					    filterable
						collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="5"
					    :multiple-limit="5"
					    :options="zones"
					    placeholder="Select zone"
					    style="width: 100%"
					 >
						     <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="holidays" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Weeks 
					</label>

					<div class="weeks">
						<el-date-picker
					      class="mb-5"
				          v-model="filter.weekFrom"
				          :disabled="(filter.season.length>0 || filter.month.length>0 || filter.holidays.length>0 || filter.zones.length>0)"
				          type="week"
				          format="YYYY-MM-DD (ww-YY)"
				          placeholder="Week from"
				        />
				        <el-date-picker
				          v-model="filter.weekTo"
				          :disabled="(filter.season.length>0 || filter.month.length>0 || filter.holidays.length>0 || filter.zones.length>0)"
				          type="week"
				          format="YYYY-MM-DD (ww-YY)"
				          placeholder="Week to"
				        />	
					</div>
				 </div>
				<div class="btn-actions">
					<button type="reset" class="btn reset" @click="reset">
				        <i class="uil uil-redo"></i>
				        Reset
				    </button>
				    <button submit class="btn">
				        <i class="uil uil-search"></i>
				        Run search
				    </button>
				</div>
            </form>            
        </template>
    </ModalComponent>
</template>
<script setup>
import { ref, computed, defineAsyncComponent, watch, onBeforeMount } from 'vue';
import { useStationsStore } from '@Stores/stations.js';
import { useCategoriesStore } from '@Stores/categories.js';
import { useNationalitiesStore } from '@Stores/nationalities.js';
import { useDestinationsStore } from '@Stores/destination.js';
import { useSeasonStore } from '@Stores/seasons.js';
import { ElMessage } from 'element-plus';
import { useWindowSize } from '@vueuse/core';

const ModalComponent = defineAsyncComponent(()=>
	import('@Components/utils/ModalComponent.vue')
)

const { width, height } = useWindowSize();
const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    return gap + 50;
});

const stationsStore = useStationsStore();
const categoriesStore = useCategoriesStore();
const nationalitiesStore = useNationalitiesStore();
const destinationsStore = useDestinationsStore();
const seasonStore = useSeasonStore();
const comparedElements = ref([
	{
		label: 'Nationality',
		value: 'nationality'
	},
	{
		label: 'Occupancy Rate',
		value: 'occupancy_rate'
	},
	{
		label: 'Fill Rate',
		value: 'fill_rate'
	},
	{
		label: 'Lot',
		value: 'lot'
	},
	{
		label: 'Bed',
		value: 'bed'
	},
	{
		label: 'Nights',
		value: 'nights'
	}
])

const filter = ref({
	category: ['FREQ GLOBALE'],
	station: [],
	massifs: [],
	panels: [],
	vallees: [],
	regions: [],
	departments: [],
	nationalities: [],
	selectedElement: 'occupancy_rate',
	month: [],
	zones:[],
	// yearone: '',
	// yeartwo: '',
	weekFrom: null,
	weekTo: null,
	result: [],
	years: [],
	season: [],
	holidays:[],
	destinations: []
})

const resultTypes = [
	{
		label: 'Month',
		value: 'month'
	},
	{
		label: 'Commercial Period',
		value: 'vacance'
	},
	{
		label: 'Week',
		value: 'week'
	}
]

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

const allData = computed(()=>props.data)
const selectedElement = computed(()=> filter.value.selectedElement)
const resultType = computed(()=>filter.value.result)

const periods = ref([
    {
        label: 'All', 
		value: 'non'
    },
	{
		label: 'Summer', 
		value: 'ETE'
	},{
		label: 'Winter',
		value: 'HIVER'
	}
]);

const show = ref(false);

const months = [
    {
        label: 'January',
        value: '01'
    },
    {
        label: 'February',
        value: '02'
    },
    {
        label: 'March',
        value: '03'
    },
    {
        label: 'April',
        value: '04'
    },
    {
        label: 'May',
        value: '05'
    },
    {
        label: 'June',
        value: '06'
    },
    {
        label: 'July',
        value: '07'
    },
    {
        label: 'August',
        value: '08'
    },
    {
        label: 'September',
        value: '09'
    },
    {
        label: 'October',
        value: '10'
    },
    {
        label: 'November',
        value: '11'
    },
    {
        label: 'December',
        value: '12'
    }
];

const selectMassif = ref([]);
const selectPanel = ref([]);
const selectVallees = ref([]);
const selectRegions = ref([]);
const massifs = ref([])
const panels = ref([])
const vallees = ref([])
const regions = ref([])
const seasons = ref([])
const departments = ref([])
const weeks = ref([]) 
const zones = ref([])


const emits = defineEmits(['searchData', 'submit', 'open', 'close', 'export']);

const stations = computed(()=>{
	let data = stationsStore.stations;
	data.sort(function(a, b) {
	   let captionA = a.caption.toUpperCase();
	   let captionB = b.caption.toUpperCase();
	   if (captionA < captionB) {
	       return -1;
	   }
	   if (captionA > captionB) {
	       return 1;
	   }
	   return 0;
	});
	let stations = data.map(function(item) {
	  return {label: item.caption, value: item.code};
	});
	return stations;
});

const categories = computed(()=>{
	let data = categoriesStore.categories;
	data.sort(function(a, b) {
	   let captionA = a.name.toUpperCase();
	   let captionB = b.name.toUpperCase();
	   if (captionA < captionB) {
	       return -1;
	   }
	   if (captionA > captionB) {
	       return 1;
	   }
	   return 0;
	});
	let categories = data.map(function(item) {
	  return {label: item.name, value: item.code};
	});
	return categories;
});

const nationalities = computed(()=>{
	let data = nationalitiesStore.nationalities;
	data.sort(function(a, b) {
	   let captionA = a.country.toUpperCase();
	   let captionB = b.country.toUpperCase();
	   if (captionA < captionB) {
	       return -1;
	   }
	   if (captionA > captionB) {
	       return 1;
	   }
	   return 0;
	});
	let nationalities = data.map(function(item) {
	  return {label: item.country, value: item.iso_code};
	});
	return nationalities;
});

const areFilterNotEmpty = computed(()=>{
	const obj = filter.value
	for (let key in obj) {
	    if (key !== 'selectedElement' && key !== 'years' && obj.hasOwnProperty(key) && (obj[key] === '' || obj[key] === [] || obj[key] === undefined || obj[key] === null)) {
	      return false;
	    }
	 }
	return true;
})

const isNullOrEmptyOrNumber = (value)=> {
  return value === null || value === '' || !isNaN(Number(value));
}

const destinations = computed(()=>{
	let data = destinationsStore.destinations;
	console.log(data)
	data.sort(function(a, b) {
	   let captionA = (a.caption == null)?a.name.toUpperCase():a.caption.toUpperCase();
	   let captionB = (b.caption == null)?b.name.toUpperCase():b.caption.toUpperCase();

	   if (captionA < captionB) {
	       return -1;
	   }
	   if (captionA > captionB) {
	       return 1;
	   }
	   return 0;
	});
	
	let destinations = data.map(function(item) {
	  let label = (item.caption == null)?item.name:item.caption
	  return {label: label, value: item.code};
	});
	return destinations;
});

const selectStation = computed(()=>{
	return filter.value.station
})

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined || value == [])?false:true;

const searchData = ()=>{
	if(IsValueOkay(filter.value.years) && IsValueOkay(filter.value.selectedElement)){
		emits('searchData', filter.value);
		show.value = false
	}else{
		 ElMessage({
		    message: 'Please fill all required filters to run the search',
		    type: 'warning',
		  })
	}
};

const openModal = ()=>{
	show.value = true;
}

const openModalV2 = ()=>{
    show.value = true;
} 

const reset = ()=>{
	filter.value = {
		category: ['FREQ GLOBALE'],
		station: [],
		massifs: [],
		panels: [],
		vallees: [],
		regions: [],
		departments: [],
		nationalities: [],
		selectedElement: 'occupancy_rate',
		month: [],
		zones:[],
		weekFrom: null,
		weekTo: null,
		result: [],
		years: [],
		season: [],
		holidays:[],
		destinations: []
	}
}

const generateYears = ()=> {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = 0; i < 10; i++) {
        years.push({
        	label: currentYear - i,
        	value: currentYear - i
        });
    }
    return years;
}

const yearsArray = generateYears();

onBeforeMount(async()=>{
	massifs.value = await stationsStore.getFeaturesByType('massifs')
	panels.value = await stationsStore.getFeaturesByType('panels')
	vallees.value = await stationsStore.getFeaturesByType('vallees')
	regions.value = await stationsStore.getFeaturesByType('regions')
	departments.value = await stationsStore.getFeaturesByType('departements')
	seasons.value = await seasonStore.getSeasons()
	zones.value = await seasonStore.getZones()
	console.log(zones.value)
});

watch(selectedElement, (newFilter, oldFilter)=>{
	if(oldFilter == 'nationality') filter.value.nationalities = [];
});

watch(resultType, (newResult, oldResult)=>{
	if(newResult == null) filter.value.result = [];
});
</script>
<style scoped>

.btn-actions{
	display: flex;
	gap:1rem;
}

form div{
	margin: 5px 0;
}

div label{
	font-size: 14px !important;
	font-weight: bold;
}

label span{
	color: red;
}

button{
 background-color: var(--color-primary);
 color: white;
 box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
 font-size: 14px;
 font-weight: 500;
 padding: 6px 10px;
 border-radius: 5px;
 transition: var(--transition);
}

button:hover{
 transform: scale(1.1);
 cursor: pointer;
}

.weeks{
	display: flex;
	gap: 1rem;
}

.app__filter{
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: flex-end;
	gap: 15px;
	background-color: white;
	box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	padding: 15px 5px;
	border-radius: 10px;
	border: solid 1px purple;
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

.login__form input{
    width: 100%;
    height: 30px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
}

.login__form button{
    height: 40px;
    cursor: pointer;
    transition: var(--transition);
    background-color: var(--color-primary);
    color: white;
    padding: 3px 10px;
    width: 100%;
    border-radius: 5px;
    margin: 10px auto;
    font-size: 14px;
    font-weight: 500;
}

.login__form button:hover{
    transform: scale(0.95);
}

.downloaded{
	border: 1px solid grey;
	border-radius: 5px;
	margin: 5px auto;
	font-size: 14px;
	font-weight: 500;
	text-align: center;
	padding: 5px 0;
	color: var(--color-success);
}
</style>