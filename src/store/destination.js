import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useDestinationsStore = defineStore("destinations", {
  state: () => ({
    destinations: [],
    entity: 'destinations',
    nb: 0,
  }),

  actions: {
    async fetchAll(source, next){
       await services.get_Record(`/destination/caption?source=${source}`, (response)=>{
         if (response.status == 200) {
            this.destinations = response.data;
            console.log(response.data)
            next(response.data);
          }
      }) 
    },
  },
});