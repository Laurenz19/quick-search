<template>
  <div>
    <div class="year-input" @click="toggleYear">
      <input
        type="text"
        v-model="selectedYearsText"
        @focus="showYearOptions = true"
        @blur="showYearOptions = false"
        @input="parseInput"
        placeholder="Select years"
        class="year-input-field"
      />
      <ul v-if="showYearOptions" class="year-options">
        <li
          v-for="year in availableYears"
          :key="year"
          @click="toggleYear"
          :class="[isSelected(year)?selected:'']"
        >
          {{ year }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
const selectedYears = ref([]);
    const selectedYearsText = ref("");
    const showYearOptions = ref(false);

    const availableYears = computed(() => {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = 2000; year <= currentYear; year++) {
        years.push(year.toString());
      }
      return years;
    });

    // const toggleYear = (year) => {
    //   console.log(year)
    //   if (isSelected(year)) {
    //     selectedYears.value = selectedYears.value.filter((y) => y !== year);
    //   } else {
    //     selectedYears.value.push(year);
    //   }
    // };

    const toggleYear = () => {
      console.log('hehe')
      // if (isSelected(year)) {
      //   selectedYears.value = selectedYears.value.filter((y) => y !== year);
      // } else {
      //   selectedYears.value.push(year);
      // }
    };

    const isSelected = (year) => {
      return selectedYears.value.includes(year);
    };

    const parseInput = () => {
      const inputText = selectedYearsText.value;
      const yearsArray = inputText.split(",").map((year) => year.trim());
      selectedYears.value = yearsArray.filter(
        (year) =>
          availableYears.value.includes(year) && !selectedYears.value.includes(year)
      );
    };

    watch(selectedYears, () => {
      selectedYearsText.value = selectedYears.value.join(", ");
    });


// import { ref, computed, watch } from "vue";

// export default {
//   setup() {
//     const selectedYears = ref([]);
//     const selectedYearsText = ref("");
//     const showYearOptions = ref(false);

//     const availableYears = computed(() => {
//       const currentYear = new Date().getFullYear();
//       const years = [];
//       for (let year = 2000; year <= currentYear; year++) {
//         years.push(year.toString());
//       }
//       return years;
//     });

//     // const toggleYear = (year) => {
//     //   console.log(year)
//     //   if (isSelected(year)) {
//     //     selectedYears.value = selectedYears.value.filter((y) => y !== year);
//     //   } else {
//     //     selectedYears.value.push(year);
//     //   }
//     // };

//     const toggleYear = (year) => {
//       console.log(year)
//       // if (isSelected(year)) {
//       //   selectedYears.value = selectedYears.value.filter((y) => y !== year);
//       // } else {
//       //   selectedYears.value.push(year);
//       // }
//     };

//     const isSelected = (year) => {
//       return selectedYears.value.includes(year);
//     };

//     const parseInput = () => {
//       const inputText = selectedYearsText.value;
//       const yearsArray = inputText.split(",").map((year) => year.trim());
//       selectedYears.value = yearsArray.filter(
//         (year) =>
//           availableYears.value.includes(year) && !selectedYears.value.includes(year)
//       );
//     };

//     watch(selectedYears, () => {
//       selectedYearsText.value = selectedYears.value.join(", ");
//     });

//     return {
//       selectedYears,
//       selectedYearsText,
//       showYearOptions,
//       availableYears,
//       toggleYear,
//       isSelected,
//       parseInput,
//     };
//   },
// };
</script>

<style scoped>
/* Add CSS styles for the input and options here */
.year-input {
  position: relative;
}

.year-input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.year-options {
  position: absolute;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 0;
  list-style: none;
  margin: 0;
  background-color: white;
  z-index: 2
}

.year-options li {
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.year-options li.selected {
  background-color: #007bff;
  color: white;
}

.year-options li:hover {
  background-color: #f0f0f0;
}
</style>
