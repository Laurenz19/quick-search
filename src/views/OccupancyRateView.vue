<template>
   <div class="occupancy">
                <div class="app__loader" v-if="dataLoad == true">
                    <SpinnerComponent :size="'small'"/> Loading ...
                </div>
                <div v-else>
                    <div v-if="disabledButton == true">
                        <div class="result__message">
                            <img src="@Assets/images/not_found-removebg-preview.png" alt="">
                            <div>Please fill all the filter to see the result!</div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="occupancyResult.length==0" class="result__message">
                            <img src="@Assets/images/not_found-removebg-preview.png" alt="">
                            <div>Oups! No results match the current filters!</div>
                        </div>
                        <table v-else class="myDataTable w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3" v-for="value, key in  occupancyResult" :key="key">
                                        {{ key }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" v-for="value, key in  occupancyResult" :key="value">
                                        {{ Number(value).toFixed(2) }}
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
</template>
<script setup>
import { ref, watch, inject } from 'vue';
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import services from '@Services/index.js';
import moment from 'moment';
const dataLoad = ref(false);
const occupancyResult = ref([]);
const selectedStation = inject('station');
const selectedCategory = inject('category');
const dateStart = inject('dateStart');
const dateEnd = inject('dateEnd');
const disabledButton = ref(true);

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined)?false:true;

watch([dateStart, dateEnd, selectedStation, selectedCategory], async ()=>{
    disabledButton.value = (IsValueOkay(dateStart.value) && IsValueOkay(dateEnd.value) && IsValueOkay(selectedStation.value) && IsValueOkay(selectedCategory.value))?false:true;

    const fromDate = IsValueOkay(dateStart.value)?moment(dateStart.value).format('YYYY-MM-DD'):'non';
    const toDate = IsValueOkay(dateEnd.value)?moment(dateEnd.value).format('YYYY-MM-DD'):'non';
    const code = IsValueOkay(selectedCategory.value)?selectedCategory.value['code']:'non';
    const station_code = IsValueOkay(selectedStation.value)?selectedStation.value['code']:'non';
    
    if(disabledButton.value == false){
        dataLoad.value = true;
        await services.occupancyRequest(station_code, code, fromDate, toDate, (response)=>{
                if(response.status == 200){
                    occupancyResult.value = response.data.occupancy_rates;
                }
                dataLoad.value = false;
        })
    }
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.not__found {
    display: flex;
    justify-content: center;
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
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
</style>