import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useSeasonStore = defineStore("seasons", {
  state: () => ({
    seasons: [],
    weeks: [],
    zones:[],
    entity: 'seasons',
    nb: 0,
  }),

  actions: {
    async fetchAll(){
     await services.get_Record(`get/saison/caption`, (response)=>{
         if (response.status == 200) {
            this.seasons = response.data;
         }
      })
    },
    async getSeasons(){
      if(this.seasons.length == 0){
        await this.fetchAll()
      }
      this.seasons = this.seasons.special?this.seasons:{...this.seasons,special: []};
      let global = this.seasons.global.map(item=>{
        return {label: item, value: item}
      })
      let special = this.seasons.special.map(item=>{
        return {label: item, value: item}
      })
      return {global, special}
    },

    async fetchWeeks(){
       await services.get_Record(`get/weeks`, (response)=>{
         if (response.status == 200) {
            this.weeks = response.data;
         }
      })
    },

    async fetchZones(){
       await services.get_Record(`get/saison/zone`, (response)=>{
         if (response.status == 200) {
            this.zones = response.data.zones;
         }
      })
    },

    async getWeeks(){
      if(this.weeks.length == 0){
        await this.fetchWeeks()
      }

      this.weeks = this.weeks.map(item=>{
        return {label: `${item.from}/${item.to}`, value: {from:item.from, to: item.to}}
      })
      
      return this.weeks
    },

    async getZones(){
        if(this.zones.length == 0){
          await this.fetchZones()
        }

        this.zones = this.zones.map(item=>{
          return {label: item.zone, value: item.id}
        })

        return this.zones
    }
  },
});