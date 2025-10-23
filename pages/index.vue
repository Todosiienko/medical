<template>
  <div class="container">
    <!-- here shoud be filter by price -->
    <div class="actions">
      <v-btn @click = 'setNewShift'>add shift</v-btn>
    </div>
    <div class="shifts-list">
      <shiftsList />
    </div>
    <v-dialog v-model="shiftsStore.shiftDialogIsOpen" transition="slide-x-reverse-transition" content-class="dialog-right" max-width="600" @afterLeave="clearShift">
      <v-card class="shift-card">
        <v-card-title>
          <div class="d-flex justify-end">        
            <v-icon @click="shiftsStore.shiftDialogIsOpen = false">mdi-close</v-icon>
          </div>
        </v-card-title>
        <v-card-item>
          <shiftCard @closeShiftDialog="shiftsStore.shiftDialogIsOpen = false"/>
        </v-card-item>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="js">
import { useShiftsStore } from '@/stores'
const shiftsStore = useShiftsStore()


const dateObject = {
  startTime:"",
  endTime:"",
  date:"",
  price:"",
  type:"",
}

const newShiftData = {
  title:"",
  description:"",
  dates:[],
  type:"new",
}

function setNewShift(){
  shiftsStore.shiftDialogIsOpen = true;
  shiftsStore.setActiveShift(newShiftData);
}

function editShift(shiftitem){
  shift.value = {type:'existing', info:shiftitem};
  shiftIsOpen.value = true;
}

function saveShift(shift){
  if(shift.type === 'existing'){
    shiftsList.value = shiftsList.value.map(item => item.id === shift.info.id ? shift.info : item)
  } else {
    shiftsList.value.push(shift.info);
  }
  shiftIsOpen.value = false;
}

function deleteShift(shift){
  shiftsList.value = shiftsList.value.filter(item => item.id !== shift.id);
}

function clearShift(){
  shiftsStore.clearActiveShift();
}

</script>
<style scoped lang="scss">

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .actions {
    // margin-bottom: 20px;
  }
  .shifts-list {
    width: 100%;
    height: 60vh;
    max-width: 1000px;
    padding: 20px;
    margin:15px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }
}

:deep(.dialog-right) {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  max-height: 100%;
  margin: 0 !important;
}
</style>