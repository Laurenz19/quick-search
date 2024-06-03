<template>
   <div class="head__container" v-if="isSearch==false">
    <i class="uil" :class="page.icon"></i>
    <div class="head__title">{{ page.firstTitle }} <b>{{ page.secondTitle }}</b></div>
   </div>
   <div class="container head__container" v-else :style="isSearch?{'backgroundColor':'#f75842', 'height':'9rem'}:{}">
        <slot name="content"></slot>
   </div>
</template>

<script setup>
const props = defineProps({
    page: {
        type: Object,
        required: false,
        default: {
            firstTitle: '',
            secondTitle: '',
            icon: '',
        }
    },
    isSearch:{
        type: Boolean,
        required: false,
        default: false,
    }
});
</script>

<style scoped>
@import "@Assets/css/base.css";

.head__container{
    background-color: rgb(245, 245, 245);
    width: 100% !important;
    height: 7.5em;
    text-align: center;
}

.head__container i{
    font-size: 40px;
    color: var(--color-primary);
    position: relative;
    top: 8px;
}

.head__container div{
    color: var(--color-bg2);
    font-size: 18px;
    position: relative;
    top: -7px;
}

@media screen and (max-width:1024px) {
    .head__container{
        position: absolute;
        top:5rem;
    }

    .head__container div{
        font-size: 20px;
    }
}

@media screen and (max-width:900px) {
    .head__container div{
        font-size: 18px;
    }
}

/* Media Queries (Phone) */
@media screen and (max-width:650px) {
    .head__container div{
        font-size: 15px;
    }
}
</style>