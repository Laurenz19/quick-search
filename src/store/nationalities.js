import { defineStore } from "pinia";
import services from '@Services/index.js';
import { useSeasonStore } from "@Stores/seasons.js";
import { useStationsStore } from "@Stores/stations.js";
import { useCategoriesStore } from "@Stores/categories.js";
import moment from "moment";

export const useNationalitiesStore = defineStore("nationalities", {
  state: () => ({
    nationalities: [],
    frequentation: [],
    entity: 'nationalities',
    nb: 0,
  }),

  actions: {
    async fetchAll(next){
      // await services.getRecords(this.entity, (response)=>{
      //   if (response.status == 200) {
      //     this.nationalities = response.data['hydra:member'];
      //     next(response.data['hydra:member']);
      //   }
      // })
      await services.get_Record('/nationality/country', (response)=>{
         if (response.status == 200) {
          console.log(response)
          this.nationalities = response.data;
          next(response.data);
        }
      }) 
    },
    async nationalityFrequentation(next){
        await services.nationalityFreqRequest((response)=>{
          if(response.status == 200){
            this.frequentation = response.data['all_nationalities'];
            next(response.data['all_nationalities'])
          }
        })
    },
    classifyFrequentationBySeason(seasons, frequentationData) {
      let classifiedData = {};
      seasons.forEach(season => {
        classifiedData[season.caption] = {}
        frequentationData.forEach(entry => {
          const entryDateFrom = moment(entry.dateFrom);
          const entryDateto = moment(entry.dateto);
          const seasonDateFrom = moment(season.dateFrom);
          const seasonDateto = moment(season.dateto);
          const key = entry.station_code + '-' + entry.category_code + '-' + season.id + '-' + entry.nationality_code;

          if (entryDateFrom.isBetween(seasonDateFrom, seasonDateto) && entryDateto.isBetween(seasonDateFrom, seasonDateto)) {
            if (!classifiedData[season.caption][key]) {
              classifiedData[season.caption][key] = {
                caption: season.caption,
                category_code: entry.category_code,
                category_name: entry.category_name,
                station_caption: entry.station_caption,
                station_code: entry.station_code,
                nationality_code: entry.nationality_code,
                country: entry.country,
                quantity: 0,
                datefrom: season.dateFrom,
                dateto: season.dateto,
                weeks: []
              };
            }
              let quantity = entry.quantity != null ? Number(entry.quantity) : 0;
              classifiedData[season.caption][key].quantity += quantity;
              classifiedData[season.caption][key].weeks.push(entry);
          }
        });
      });
      
      classifiedData = this.generateGlobaldata(classifiedData)
      return classifiedData;
    },
    generateGlobaldata(classifiedData){
      let data = null;
      let empty_seasons = [];
      for (const season_caption in classifiedData) {
        if(Object.keys(classifiedData[season_caption]).length > 0) data = classifiedData[season_caption];
        else empty_seasons.push(season_caption);
      }

      if(data !== null){
        empty_seasons.forEach(season=>{
           for (const freqkey in data) {
             let entry = data[freqkey];
             const key = entry.station_code + '-' + entry.category_code + '-' + season + '-' + entry.nationality_code;
              classifiedData[season][key] = {
                caption: season,
                category_code: entry.category_code,
                category_name: entry.category_name,
                station_caption: entry.station_caption,
                station_code: entry.station_code,
                nationality_code: entry.nationality_code,
                country: entry.country,
                quantity: 0,
                datefrom: '',
                dateto: '',
                weeks: []
              };
          }
        });
      }
      return classifiedData;
    },
    async nationalityPerSeason(next){
      const seasonStore = useSeasonStore();
      let classifiedFrequentation = this.classifyFrequentationBySeason(seasonStore.seasons, this.frequentation);
      next(classifiedFrequentation);
    }
  },
 });