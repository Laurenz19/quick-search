s<template>
<transition name="modal-flip">
    <div v-if="props.showModal" class="modal">
          <!-- Modal content here -->
        <div class="modal-content" :style="{'height':`${props.height}%`, 'width': `${props.width}%`}">
            <slot name="content"></slot>
            <!-- <h2>Modal Title</h2>
            <p>Modal content goes here.</p>
            <button @click="toggleModal()">Close</button> -->
        </div>
    </div>
</transition>
</template>
<script setup>
const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
    height:{
      type: Number,
      default: 90
    },
    width:{
      type: Number,
      default: 90
    }
});
const emit = defineEmits(['close'])


const toggleModal = () => {
   emit('close');
};
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* display: flex; */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.modal-content {
  background-color: #fff;
  /* width: 90%; */
  margin: 6rem auto;
  padding: 25px;
  border-radius: 5px;
  overflow-y: auto;
  /* height: 90%; */
}
</style>  