<template>
    <EasyDataTable
        :headers="headers"
        :items="data"
    >
      <template #item-week="item">
        {{ item.week }}
      </template>
      <template #item-night="item">
        <span class="bg-green-100 text-green-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{{ formatNumber(item.nights) }}</span>
      </template>
      <template #item-occupancy_rate="item">
        {{ item.occupancy_rate }}
      </template>
      <template #item-dates="item">
        {{ item.dates }}
      </template>
    </EasyDataTable>
</template>
<script setup>
import { inject, ref } from 'vue';
import moment from 'moment';

const data = inject('modalData');
const headers = ref([
        { text: "Week", value: "week" },
        { text: "Nights", value: "night" },
        { text: "Occupancy Rate", value: "occupancy_rate"},
        { text: "Dates", value: "dates"},
]);

const formatNumber = (value) => {
      if(value == undefined || value == null) value = 0;
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
</script>
<style scoped>
</style>