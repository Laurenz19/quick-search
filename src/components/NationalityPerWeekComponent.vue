<template>
    <EasyDataTable
        :headers="headers"
        :items="modalData"
    >
    <template #item-week="item">
        {{ item.week }}
      </template>
      <template #item-quantity="item">
        <span class="bg-green-100 text-green-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{{ formatNumber(item.quantity) }}</span>
      </template>
      <template #item-dates="item">
       {{ item.dates }}
      </template>
    </EasyDataTable>
</template>
<script setup>
import { inject, ref } from 'vue';
import moment from 'moment';

const modalData = inject('modalData');
const headers = ref([
        { text: "Week", value: "week" },
        { text: "Quantity", value: "quantity"},
        { text: "Dates", value: "Dates"},
]);

const formatNumber = (value) => {
      if(value == undefined || value == null) value = 0;
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>