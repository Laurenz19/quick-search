<template>
 <EasyDataTable
    :headers="headers"
    :items="items"
    :rows-items="rowsItems"
    :rows-per-page="10"
    :body-row-class-name="bodyRowClassNameFunction"
    buttons-pagination theme-color="#6c63ff" 
    table-class-name="customize-table"
    empty-message="nothing"
    @update-page-items="removeClassName"
  >
  	<template #empty-message>
	    <a href="https://google.com">nothing here</a>
	</template>
  </EasyDataTable>
</template>
<script setup>
import { computed, watch, ref, onMounted } from 'vue';
const props = defineProps({
	customHeaders: {
		type: Array,
		required: false,
		default: [ 
			{ text: "PLAYER", value: "player" },
			{ text: "HEIGHT", value: "indicator.height" },
			{ text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
		]
	},
	generateHeaders: {
		type: Boolean,
		required: false,
		default: true
	},
	data:{
		type: Object,
		required: true,
	},
	items: {
		type: Array,
		required: false,
		default: [
			{ player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: {"height": '6-2', "weight": 185}, lastAttended: "Davidson", country: "USA"},
		]
	}
});

const rowsItems = [5, 10, 25, 50, 100]

const getMonthTranslations = ()=>{
	let monthTranslations = {};

	for (let i =  0; i <  12; i++) {
	  const date = new Date(2000, i); // Use a fixed year to avoid issues with leap years
	  const fullMonthName = date.toLocaleString('en-us', { month: 'long' });
	  const abbreviatedMonthName = date.toLocaleString('en-us', { month: 'short' });
	  monthTranslations[abbreviatedMonthName + "-"] = fullMonthName;
	}
	return monthTranslations;
}

const getWidthValue = (text)=> {
  let divTemp = document.createElement('div');
  divTemp.style.position = 'absolute';
  divTemp.style.visibility = 'hidden';
  divTemp.style.width = 'auto';
  divTemp.style.height = 'auto';
  divTemp.style.whiteSpace = 'nowrap';
  divTemp.textContent = text;
  document.body.appendChild(divTemp);
  let largeur = divTemp.offsetWidth;
  document.body.removeChild(divTemp);
  return largeur + 50;
}

const generateHeadersFromItems = (items)=>{
	let headers = []
	const data = props.data
	console.log(items)
	if(items.length>0){
		headers = Object.keys(items[0]).map(key => {
		  // let text = key;
		  // let value = key;
		  // let sortable = true;

		  // const monthTranslations = getMonthTranslations()

		  // Object.entries(monthTranslations).forEach(([abbr, translated]) => {
		  //   if (key.includes(abbr)) {
		  //     text = translated + ' ' + key.slice(-2);
		  //   }
		  // });

		  // return { text, value, sortable };
		  console.log(key)
		  if (key !== "destination" && key !== "category" && key !== "station" && key !== "nationality" && key !== "season" && key !== "max" && key !== "massif" && key !== "vallee" && key !== "panel" && key !== "region") {
                let text = key;
                let value = key;
                let sortable = true;

                const monthTranslations = getMonthTranslations()

                // Traduire les abbréviations de mois si présents
                Object.entries(monthTranslations).forEach(([abbr, translated]) => {
                    if (key.includes(abbr)) {
                        text = translated + ' ' + key.slice(-2);
                    }
                });
                
                return { text, value, sortable, width: getWidthValue(text)};
            }
		});

		headers = headers.filter(value => value !== undefined)
		if(items[0].season !== undefined){
			headers.unshift({ text: "Season", value: "season", sortable: true, width: 200})
		}

		if(items[0].nationality !== undefined){
			headers.unshift({ text: "Nationality", value: "nationality", sortable: true, width: 200})
		}

		if(items[0].category !== undefined){
			headers.unshift({ text: "Category", value: "category", sortable: true, width: 200})
		}

		if(items[0].vallee !== undefined){
			headers.unshift({ text: "Vallee", value: "vallee", sortable: true, width: 200})
		}

		if(items[0].region !== undefined){
			headers.unshift({ text: "Region", value: "region", sortable: true, width: 200})
		}

		if(items[0].panel !== undefined){
			headers.unshift({ text: "Panel", value: "panel", sortable: true, width: 200})
		}

		if(items[0].massif !== undefined){
			headers.unshift({ text: "Massif", value: "massif", sortable: true, width: 200})
		}

		if(items[0].destination !== undefined){
			headers.unshift({ text: "Destination", value: "destination", sortable: true, fixed: true, width: 200})
		}

		if(items[0].station !== undefined){
			headers.unshift({ text: "Station", value: "station", sortable: true, fixed: true, width: 200})
		}
	}else{
		if(data.season){
			headers.unshift({ text: "Season", value: "season"});
		}

		if(data.nationalities){
			headers.unshift({ text: "Nationality", value: "nationality"});
		}

		if(data.categories){
			headers.unshift({ text: "Category", value: "category"})
		}

		if(data.destinations){
			headers.unshift({ text: "Destination", value: "destination"})
		}

		if(data.stations){
			headers.unshift({ text: "Station", value: "station"})
		}
	}
	return headers;
};

const headers = computed(()=>{
	if(!props.generateHeaders) return props.customHeaders;
	return generateHeadersFromItems(props.items);
});

const bodyItemClassNameFunction= (column, rowNumber) => {
  const data = props.data;
  if (column === 'score') return 'score-column';
  return '';
};

const maxCell = ref([])

const bodyRowClassNameFunction = (item, rowNumber)=> {
  for(const key in item){
  		if((key !== 'max') && (item[key] == item.max) && item.max != 0){
  			maxCell.value.push({
				row: rowNumber -1 ,
				max: item.max
			})
			maxCell.value.forEach(item=>{
				addClassName(item.row, item.max)
			})
			maxCell.value = []
		  	return 'row_max_value'
  		}	
  }
  return '';
};

const addClassName = (rowIndex, max) => {
    const rows = document.querySelectorAll('.vue3-easy-data-table__body tr');
    if (rows.length>0) {
        const row = rows[rowIndex];
        if(row !== undefined){
        	 const cells = row.querySelectorAll('td');
	        cells.forEach(cell => {
	            if (cell.innerHTML == max) {
	                cell.classList.add('max_value');
	            }
	        });
        }
    } else {
        console.error(`Row index ${rowIndex} is out of bounds.`);
    }
};

const removeClassName = ()=>{
	const rows = document.querySelectorAll('.vue3-easy-data-table__body tr');
	for(const row of rows){
		const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
          cell.classList.remove('max_value');
        });
	}
};

</script>
<style>
.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #e7ecf3;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: white;
  --easy-table-header-background-color: var(--color-bg);

  --easy-table-header-item-padding: 10px 15px;

 /* --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;*/

  --easy-table-body-row-font-color: var(--color-bg);
  --easy-table-body-row-background-color: white;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 13px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: var(--color-bg);
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 13px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
  font-weight: 500;
}

body .vue3-easy-data-table__body tr.row_max_value {
 /* --easy-table-body-row-background-color: #ffef00;*/
  --easy-table-body-row-font-color: black !important;
 /* font-size: 15px;*/
}

body .vue3-easy-data-table__body td.max_value {
  --easy-table-body-row-background-color: #ffef00;
  font-size: 15px;
}

</style>