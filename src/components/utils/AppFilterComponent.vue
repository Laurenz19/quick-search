<template>
	<div class="app__filter">
		 <button @click="$emit('export')" v-if="allData.items.length>0">
		    <i class="uil uil-file-download"></i>
          	Export
	     </button>
	    <!--  <button @click="openModal" v-if="filter">
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
	:height="65" 
	:width="modalWidth">
        <template #content>
            <div class="modal__close">
                <i class="uil uil-times-circle mb-8"  @click="show=false"></i>
            </div>
            <div class="modal__header">
                <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">
                	{{title}}
                </h4>
            </div>
            <form @submit.prevent="searchData" @keydown.enter.prevent="searchData" class="login__form">
            	<div>
				    <label for="type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Rate type <span>*</span>
				    </label>
				     <el-select-v2
				            id="type"
						    v-model="selectType"
						    filterable
						    clearable
						    :options="types"
						    placeholder="select types"
						    style="width: 100%"
						 >
						    <template #default="{ item }">
						      <span style="margin-right: 8px">{{ item.label }}</span>
						    </template>
					</el-select-v2>
				 </div>
				 <div>
				    <label for="destination" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Destinations
				    </label>
				     <el-select-v2
				        id="destination"
					    v-model="selectDestination"
					    filterable
					    :options="destinations"
					    clearable
					    :disabled="selectStation.length>0"
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
				    	Stations 
					</label>
				     <el-select-v2
				        id="station"
					    v-model="selectStation"
					    filterable
					    :disabled="selectDestination.length>0"
					    :options="stations"
					    clearable
					    placeholder="select stations"
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
				    <label for="massifs" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Massifs
					</label>
				     <el-select-v2
				        id="massifs"
					    v-model="selectMassif"
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
					    v-model="selectPanel"
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
					    v-model="selectVallees"
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
					    v-model="selectRegions"
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
				    <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
				    	Categories <!-- <span>*</span> -->
					</label>
				     <el-select-v2
				     	id="category"
					    v-model="selectCategory"
					    filterable
					    clearable
					    :options="categories"
					    placeholder="select category"
						multiple
						collapse-tags
					    collapse-tags-tooltip
					    :max-collapse-tags="3"
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
				 <div>
				    <label for="period" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Months
					</label>
				      <el-date-picker
				        id="period"
				        v-model="selectPeriod"
				        type="monthrange"
				        range-separator="To"
				        start-placeholder="Start month"
				        end-placeholder="End month"
				        style="width: 100%"
				      />
				 </div>
				<!-- <button sybmit class="btn">
			        <i class="uil uil-search"></i>
			        Run search
			    </button> -->
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
import { useDestinationsStore } from '@Stores/destination.js';
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
const destinationsStore = useDestinationsStore();
const selectStation = ref([]);
const selectMassif = ref([]);
const selectPanel = ref([]);
const selectVallees = ref([]);
const selectRegions = ref([]);
const selectDestination = ref([]);
const selectCategory = ref([]);
const selectPeriod = ref();
const selectType = ref();

const periods = ref([
	{
		label: 'Summer', 
		value: 'ETE'
	},{
		label: 'Winter',
		value: 'HIVER'
	}
]);

const show = ref(false);

const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	title:{
		type: String,
		default: "App Filter"
	}
})

const allData = computed(()=>props.data)

const types = ref([
	{
		label: 'Occupancy rate',
		value: 'occupancy_rate'
    },
    {
		label: 'Fill rate',
		value: 'fill_rate'
    }
])

const emits = defineEmits(['searchData', 'submit', 'open', 'close', 'export']);
const filter = ref({
	category: '',
	station: [],
	periods: [],
	type: '',
	destinations: ''
})

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

const massifs = ref([])
const panels = ref([])
const vallees = ref([])
const regions = ref([])

// watch(selectStation, async()=>{
// 	massifs.value = await stationsStore.getFeaturesByType(selectStation.value, 'massifs')
// 	panels.value = await stationsStore.getFeaturesByType(selectStation.value, 'panels')
// 	vallees.value = await stationsStore.getFeaturesByType(selectStation.value, 'vallees')
// 	regions.value = await stationsStore.getFeaturesByType(selectStation.value, 'regions')
// })

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined)?false:true;

const searchData = ()=>{
	if(IsValueOkay(selectPeriod.value) && IsValueOkay(selectType.value)){
		filter.value = {
			category: IsValueOkay(selectCategory.value)?selectCategory.value:['FREQ GLOBALE'],
			station: selectStation.value,
			panels: selectPanel.value,
			vallees: selectVallees.value,
			regions: selectRegions.value,
			massifs: selectMassif.value,
			periods: selectPeriod.value,
			type: selectType.value,
			destinations: selectDestination.value
		};
		emits('searchData', filter.value)
		show.value = false
	}else{
		 ElMessage({
		    message: 'Please fill all the filters to run the search',
		    type: 'warning',
		  })
	}
};

const openModal = ()=>{
	selectStation.value = filter.value.station;
    selectCategory.value = filter.value.category;
    selectType.value = filter.value.type;
    selectPeriod.value = filter.value.periods;
    selectDestination.value = filter.value.destinations;
	show.value = true;
};

const openModalV2 = ()=>{
	// selectStation.value = [];
 //    selectCategory.value = null;
 //    selectType.value = null;
 //    selectPeriod.value = [];
 //    selectDestination.value = [];
 //    selectVallees.value = [];
 //    selectMassif.value = [];
 //    selectRegions.value = [];
 //    selectPanel.value = [];
    show.value = true;
};

const reset = ()=>{
	selectStation.value = [];
    selectCategory.value = null;
    selectType.value = null;
    selectPeriod.value = [];
    selectDestination.value = [];
    selectVallees.value = [];
    selectMassif.value = [];
    selectRegions.value = [];
    selectPanel.value = [];	
}

onBeforeMount(async()=>{
	massifs.value = await stationsStore.getFeaturesByType('massifs')
	panels.value = await stationsStore.getFeaturesByType('panels')
	vallees.value = await stationsStore.getFeaturesByType('vallees')
	regions.value = await stationsStore.getFeaturesByType('regions')
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