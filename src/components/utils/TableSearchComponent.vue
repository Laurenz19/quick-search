<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead>
          <tr class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <th scope="col" class="px-6 py-3" v-if="allData.stations.length>0">Stations</th>
            <th scope="col" class="px-6 py-3" v-if="allData.destinations.length>0">Destinations</th>
            <th scope="col" class="px-6 py-3">Category</th>
            <template v-for="(month, index) in allData.months" :key="index">
              <th scope="col" class="px-6 py-3">{{ month }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in allData.items" :key="index">
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ item.station }}</td>
              <td class="px-6 py-4">{{ item.category }}</td>
              <template v-for="(month, monthIndex) in allData.months" :key="monthIndex">
                <td class="px-6 py-4">{{ item[month] || 0 }}</td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </template>
  <script>
  export default {
    props: {
      allData: Object
    }
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
  </style>