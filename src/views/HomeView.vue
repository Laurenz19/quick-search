<template>
     <HeadComponent 
    :page="page">
    </HeadComponent>
<div class="container home__container">
    <div id="greeting">
        <span>Welcome {{userStore.user.lastname}} {{userStore.user.firstname}}!</span> Explore, Analyze, and Compare vast data to gain powerful insights instantly and Find exactly what you need and more!
    </div>
    <div id="features__list">
        <ul>
            <li @click="goTo('SearchTemp')">
                <i class="uil uil-file-search-alt"></i>
                <h3>Quickly search for specific information</h3>
                <span>
                    Instantly locate precise information with our efficient quick search feature, making data retrieval a breeze.
                </span>
            </li>
            <li @click="goTo('AnalysisComparison')">
                <i class="uil uil-chart-line"></i>
                <h3>Analysis & Comparison</h3>
                <span>
                    Compare similar data across multiple periods and different locations effortlessly
                </span>
            </li>
            <li @click="goTo('Global')">
               <i class="uil uil-clipboard-notes"></i>
                <h3>Global, Night & Stocks</h3>
                <span>
                   View all night frequentation and all stocks
                </span>
            </li>
        </ul>
    </div>
</div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/index.js";
import HeadComponent from '@Components/layouts/HeadComponentTemp.vue';


const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();

const page = ref({
    firstTitle: '',
    secondTitle: 'Home Page',
    path: '/home',
    icon: 'uil-estate',
})

const goTo = (name)=>{
    appStore.isLoading = true;
    setTimeout(()=>{
        router.push({name: name});
    }, 100)
};
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.home__container{
    height: inherit;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
}

#greeting{
    margin: 50px auto 20px auto;
    color: var(--color-bg2);
    font-weight: 600;
    width: 90%;
}

#greeting span{
    font-weight: bold;
    font-size: 18px;
    color: var(--color-primary);
}

#features__list ul{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    margin: auto;
}

#features__list li{
    flex-basis: 25rem;
    border-radius: 5px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--light-color-bg1);
}

#features__list li:hover{
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    cursor: pointer;
}

#features__list i{
    font-size: 50px;
    color: var(--color-primary);
}

#features__list h3{
   color: var(--color-bg2);
   font-size: 14px;
   font-weight: bold;
}

#features__list span{
   color: var(--color-bg2);
   font-size: 14px;
   text-align: justify;
   line-height: 1.3;
   margin: 10px 0;
}

@media screen and (max-width:1024px) {
    .home__container{
        position: relative;
        top: 9rem;
    }
}
</style>