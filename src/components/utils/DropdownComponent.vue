<template>
<div :class="['mt-2 mb-2', props.showTitle==true?'px-5 py-1':'']" ref=target>
  <div class="max-w-md">
    <label for="select" class="font-semibold text-sm block" v-if="props.showTitle==true">{{ title }}</label>
    <div class="relative" v-if="isDataObject">
     <div :class="['input__container h-10 bg-white flex border border-gray-200 rounded items-center', showData==true?'dropdown__on':'']">
        <input readonly v-model="selectedValue" name="select" id="select" class="px-3 appearance-none outline-none text-gray-800 w-full text-sm" checked @keyup.enter="setShowData(true, selectedValue, $event)" @click="setShowData(true, selectedValueObject, $event)" :placeholder="placeholder"/>
        <button v-if="selectedValueObject && props.default == ''" class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600"  @click="setShowData(true, props.default, $event)">
          <svg class="w-4 h-4 mx-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div :class="['list absolute rounded shadow bg-white overflow-hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200', showData == false?'hidden':'']">
        <div class="dropdown__search border border-gray-200 m-1 p-1" v-if="props.isSearch">
          <input v-model="inputSearch" class="px-5 appearance-none outline-none text-gray-800 w-full text-sm" placeholder="Search..."/>
        </div>
        <div v-if="props.isClearable" :class="['cursor-pointer group', 'border-b']" @click="setShowData(false, '', $event)">
          <a class="block p-4 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100 text-sm"></a>
        </div>
        <div v-for="(item, index) in visibleData" :class="['cursor-pointer group', index > 0?'border-t':'']" @click="setShowData(false, item, $event)">
          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100 text-sm">{{ item[props.objectKey] }}</a>
        </div>
         <Pagination  v-if="_data.length > props.nbData" :config="paginationConfig" @updatePage="updatePage" :color="'#6c63ff'" :nb="_data.length" :data="visibleData"></Pagination>
      </div>
    </div>
    <div class="relative" v-else>
      <div :class="['input__container h-10 bg-white flex border border-gray-200 rounded items-center', showData==true?'dropdown__on':'']">
        <input readonly v-model="selectedValue" name="select" id="select" class="px-3 appearance-none outline-none text-gray-800 w-full text-sm" checked @keyup.enter="setShowData(true, selectedValue, $event)" @click="setShowData(true, selectedValue, $event)" :placeholder="placeholder"/>
        <button v-if="selectedValue && props.default == ''" class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600"  @click="setShowData(true, props.default, $event)">
          <svg class="w-4 h-4 mx-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div :class="['list absolute rounded shadow bg-white overflow-hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200', showData == false?'hidden':'']">
        <div class="dropdown__search border border-gray-200 m-1 p-1" v-if="props.isSearch">
          <input v-model="inputSearch" class="px-5 appearance-none outline-none text-gray-800 w-full text-sm" placeholder="Search..."/>
        </div>
        <div v-if="props.isClearable" :class="['cursor-pointer group', 'border-b']" @click="setShowData(false, '', $event)">
          <a class="block p-4 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100 text-sm"></a>
        </div>
        <div :class="['cursor-pointer group', index > 0?'border-t':'', selectedValue==item?'selected':'']" v-for="(item, index) in visibleData" @click="setShowData(false, item, $event)">
          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100 text-sm">{{ item }}</a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import {ref, watch, onUpdated, onBeforeMount, computed} from 'vue';
import { onClickOutside } from '@vueuse/core';
import Pagination from '@Components/utils/CommentPagination.vue';

const props = defineProps({
    data : {
        type: Array,
        default: ['Node', 'PHP', 'Javascript', 'Python'], 
    },
    objectKey:{
      type: String,
      default: 'name'
    },
    title:{
        type: String,
        default: 'Custom dropdown'
    }, 
    showTitle: {
      type: Boolean,
      default: true
    },
    placeholder: {
        type: String, 
        default: 'Select a value'
    },
    default:{
        type: String,
    },
    defaultObj:{
       type: Object
    },
    isDataObject:{
      type: Boolean,
      default: false,
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    nbData : {
      type: Number,
      default: 5
    },
    isClearable:{
      type: Boolean,
      default: true,
    }, 
    clearValue:{
      type: Boolean,
      default: false,
    }
});
const emit = defineEmits(['submit', 'clear']);

let selectedValue = ref('');
let selectedValueObject = ref({'caption':'', 'english':''});
let showData = ref(false);
let target = ref(null);
let inputSearch = ref('');

const propsData = computed(() => props.data)
const _data = ref([]);
_data.value = propsData.value;

const _clearValue = computed(() => props.clearValue);
watch(_clearValue, ()=>{
  if(_clearValue.value == true) {
    if(props.isClearable==true) setShowData(false, '', null);
    else{
      if(props.isDataObject==false) setShowData(false, propsData.value[0], null);
    } 
  }
})

let visibleData = ref([])
let paginationConfig = ref({
    current:0,
    size: props.nbData,
    data: [],
    _data: []
})

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleData(_data.value);
}


let updateVisibleData = function(_data2){
    let data2 = paginationConfig.value;

    if(props.isDataObject == true){
        _data2.sort((a, b) => {
          const nameA = a[props.objectKey].toLowerCase();
          const nameB = b[props.objectKey].toLowerCase();

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
      });
      }

    paginationConfig.value.data = _data2.slice(data2.current*data2.size, (data2.current * data2.size) + data2.size);

    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage( paginationConfig.value.current -1);
    }

    visibleData.value = paginationConfig.value.data;
}


const setShowData = (value, selected_value, event) =>{
    showData.value = value;
    if(value) inputSearch.value = '';
    if(selected_value !== undefined){
      if(props.isDataObject == true){
        selectedValue.value = selected_value[props.objectKey];
        selectedValueObject.value = selected_value;
      }else{
        selectedValue.value = selected_value;
      }      
    }
 
}

onClickOutside(target, (event) =>{
  if(props.isDataObject == true){
    setShowData(false, selectedValueObject.value, event)
    }else{
    setShowData(false, selectedValue.value, event)
  } 
});

watch(selectedValue, () => {
  if(selectedValue !== ''){
    if(props.isDataObject == true){
      emit('submit', selectedValueObject.value);
    }else{
      emit('submit', selectedValue.value);
    }
  }else emit('clear');
});

watch(_data, () => {
  if(props.isDataObject == true){
    emit('submit', selectedValueObject.value);
  }else{
    emit('submit', selectedValue.value);
  }
});


watch(inputSearch, ()=>{
    _data.value = propsData.value

    if(inputSearch.value == ''){
      _data.value = propsData.value
      updateVisibleData(_data.value);
    }else{
      let result = [];
      if(props.isDataObject == false){
       _data.value.forEach(element => {
          let value = element.toLowerCase();
          let search = inputSearch.value.toLowerCase();
          if(value.includes(search)) result.push(element);
       });
       _data.value = result;
      }else{
        _data.value.forEach(element => {
          let value = element[props.objectKey].toLowerCase();
          let search = inputSearch.value.toLowerCase();
          if(value.includes(search)) result.push(element);
       });
       _data.value = result;
      }
      updateVisibleData(_data.value);
    }
    console.log(inputSearch.value)
});


onBeforeMount(()=>{
    if(props.isDataObject == true){
      if(selectedValueObject.value != undefined){
        selectedValueObject.value = props.defaultObj;
        emit('submit', selectedValueObject.value);
      }
    }else{
      selectedValue.value = props.default;
      emit('submit', selectedValue.value);
    }
});

if(props.data !== undefined){
  updateVisibleData(_data.value);
}
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.selected{
    background-color: var(--color-primary);
    color: var(--color-white)
}

#select {
    font-weight: 500;
}

.dropdown__on{
  border-color: var(--color-primary);
}

.input__container:hover{
  border-color: var(--color-primary);
}

.list{
    z-index:2;
}
</style>