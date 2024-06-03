<template>
  <NavbarComponent></NavbarComponent>
    <div class="app__loader" :style="loaderStyle" v-show="appStore.isLoading">
      <SpinnerComponent :size="'large'" v-if="appStore.isLoading"/>
    </div>
    <div class="main__container">
      <RouterView/>
    </div>
  <FooterComponent></FooterComponent>
</template>

<script setup>
import {onBeforeMount, ref, watch, defineAsyncComponent} from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { initFlowbite } from 'flowbite';
import NavbarComponent from '@Components/layouts/NavbarComponent.vue';
import FooterComponent from '@Components/layouts/FooterComponent.vue';
import { useWindowSize } from '@vueuse/core';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/index.js";

const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const SpinnerComponent = defineAsyncComponent(()=>
  import('@Components/utils/SpinnerComponent.vue')
)

if(userStore.roleSummary == ''){
  userStore.roleSummary = localStorage.getItem('user_role')
}

// initialize components based on data attribute selectors
onBeforeMount(async() => {
    initFlowbite();
})

const{ width, height} = useWindowSize();
const loaderStyle = ref({
  'width': `${width.value}px`, 
});

watch(width, () => {
  loaderStyle.value = {
    'width': `${width.value}px`, 
  }
});
</script>

<style scoped>
.app__loader{
  background: white;
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 3;
  height: 100%;
}

*{
  caret-color: transparent;
}

input{
  caret-color: var(--color-bg2) !important;
}

</style>
