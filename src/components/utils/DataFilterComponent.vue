<template>
	<div class="app__filter">
		<button @click="reset">
           <i class="uil uil-history-alt"></i>
            Reset
        </button>
        <button @click="openModal" v-if="!isFilterDefault(filter, {
			station: '',
			period: '',
			year: '',
		    category: '',
		})">
		    <i class="uil uil-filter"></i>
		       Custom Filter
	     </button>
        <button @click="openModalV2">
            <i class="uil uil-filter"></i>
            New Filter
        </button>
	</div>
    <ModalComponent 
	:showModal="show" 
	@close="show=false" 
	:height="62" 
	:width="modalWidth">
        <template #content>
            <div class="modal__close">
                <i class="uil uil-times-circle mb-8"  @click="show=false"></i>
            </div>
            <div class="modal__header">
                <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">Filter</h4>
            </div>
            <form @submit.prevent="searchData" @keydown.enter.prevent="searchData" class="login__form">
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
				    	Stations <!-- <span>*</span> -->
					</label>
                    <el-select-v2
				        id="station"
					    v-model="selectStation"
					    filterable
					    :options="stations"
					    clearable
					    :disabled="selectDestination.length>0"
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
				    <label for="month" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Period
					</label>
                    <el-select-v2
				        id="period"
					    v-model="selectPeriod"
					    filterable
					    clearable
					    :options="periods"
					    placeholder="select period"
					    style="width: 100%"
					 >
					     <template #default="{ item }">
					      <span style="margin-right: 8px">{{ item.label }}</span>
					    </template>
				    </el-select-v2>
                </div>
                <div>
				    <label for="month" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					    Year
					</label>
                    <el-select-v2
				        id="year"
					    v-model="selectYears"
					    filterable
					    clearable
					    :options="yearsArray"
					    placeholder="select year"
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
			
				
				<button sybmit class="btn">
			        <i class="uil uil-search"></i>
			        Run search
			    </button>
            </form>  
        </template>
    </ModalComponent>
</template>
<script setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue';
import { useStationsStore } from '@Stores/stations.js';
import { useCategoriesStore } from '@Stores/categories.js';
import { useDestinationsStore } from '@Stores/destination.js';
import { ElMessage } from 'element-plus';
import { useWindowSize } from '@vueuse/core';

const ModalComponent = defineAsyncComponent(()=>
	import('@Components/utils/ModalComponent.vue')
);

const { width, height } = useWindowSize();
const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    return gap + 50;
});

const show = ref(false);

const stationsStore = useStationsStore();
const categoriesStore = useCategoriesStore();
const destinationsStore = useDestinationsStore();
const selectStation = ref([]);
const selectDestination = ref([]);
const selectCategory = ref();
const selectMonth = ref();
const selectYears = ref([]);
const selectPeriod = ref();

console.log(selectCategory.value);
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

const allData = computed(()=>props.data)

const emits = defineEmits(['searchData', 'submit', 'open', 'close', 'reset']);
const filter = ref({
	station: '',
	period: '',
	year: '',
    category: '',
    destination: ''
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

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined || value == [])?false:true;

const searchData = ()=>{
	filter.value = {
            category: selectCategory.value,
			station: selectStation.value,
            period: selectPeriod.value,
			year: selectYears.value,
			destination: selectDestination.value
	}
    console.log("filter "+ filter.value.year)

    emits('searchData', filter.value);
	show.value = false
};

const openModal = ()=>{
	selectStation.value = filter.value.station;
    selectCategory.value = filter.value.category;
    selectPeriod.value = filter.value.period;
    selectYears.value = filter.value.year;
    selectDestination.value = filter.value.destination
	show.value = true;
};

const openModalV2 = ()=>{
	selectStation.value = [];
	selectDestination.value  = [];
    selectCategory.value = null;
    selectMonth.value = null;
    selectYears.value = null;
    show.value = true;
}

function isFilterDefault(currentFilter, defaultFilter) {
    return (
        currentFilter.station === defaultFilter.station &&
        currentFilter.period === defaultFilter.period &&
        currentFilter.year === defaultFilter.year &&
        currentFilter.category === defaultFilter.category
    );
} 

function generateYears() {
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

const reset = ()=>{
	emits('reset')
}
const yearsArray = generateYears();

</script>
<style scoped>
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