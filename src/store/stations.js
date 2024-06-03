import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useStationsStore = defineStore("stations", {
  state: () => ({
    stations: [],
    entity: 'stations',
    stationFeatures: null,
    selectedStation: null,
    nb: 0,
  }),

  actions: {
    async fetchAll(next){
      await services.get_Record('/station/name', (response)=>{
         if (response.status == 200) {
            this.stations = response.data;
            next(response.data);
          }
      }) 
    },

    IsValueOkay(value){
      return (value == '' || value == null || value == undefined || value == [])?false:true
    },

    async getStationFeatures(){
      let api='/get/station/filter';
      let apiParams = ''

      const response = await new Promise((resolve, reject) => {
          services.get_Record(api, (response) => {
            resolve(response);
          });
        });
      console.log(response)
      
        if(response.status == 200){
          this.stationFeatures = response.data;
        }
    },
    //type can be vallees, panels, regions, massifs, departments
    async getFeaturesByType(type){
      let data = []
      if(this.stationFeatures == null){
        await this.getStationFeatures()
      }

      if(this.stationFeatures){
         data = Object.keys(this.stationFeatures[type])
         console.log(this.stationFeatures[type])
         console.log('eto', data)
         if(type == 'departements'){
            data = data.map(item=> {
              return {
                value: item, 
                label: item,
                options: this.stationFeatures[type][item].map(_item=>{ return {value: _item.num, label: _item.name}})
              }
            })    
         }else{
            data = data.map(item=> {
              return {value: item, label: item}
           })
         }
      }
      return this.stationFeatures?data:[]
    }
  },
});