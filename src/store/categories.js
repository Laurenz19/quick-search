import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
    entity: 'categories',
    nb: 0,
  }),

  actions: {
    async fetchAll(next){
      // await services.getRecords(this.entity, (response)=>{
      //   if (response.status == 200) {
      //     this.categories = response.data['hydra:member'];
      //     next(response.data['hydra:member']);
      //   }
      // })

       await services.get_Record('/category/name', (response)=>{
         if (response.status == 200) {
            // this.categories = response.data.filter(c=>c.code !== 'FREQ GLOBALE');
             this.categories = response.data;
            next(response.data);
          }
      }) 
    },
  },
});