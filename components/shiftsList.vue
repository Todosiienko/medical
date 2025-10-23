<template>
  <div class="shiftsWrapper">
    <shiftListCard v-for="shift in list" :key="shift.id" :shift="shift" class="mb-5" @editShift="editShift"/>
  </div>
</template>
<script setup>

import { useShiftsStore } from '@/stores'
const shiftsStore = useShiftsStore()

const list = computed(() => {
  return shiftsStore.shifts
})

const props = defineProps({
  list:Array,
  default: ()=>[]
})
const emits = defineEmits([
  'editShift',
  'deleteShift'
])
function editShift(item){
  shiftsStore.setActiveShift({...item, type:'edit'})
  shiftsStore.shiftDialogIsOpen = true;
}

function deleteShift(item){
  emits('deleteShift', item)
}

</script>
<style scoped lang="scss"></style>
