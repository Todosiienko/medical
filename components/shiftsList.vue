<template>
  <div class="shiftsWrapper">
    <shiftListCard v-for="shift in list" :key="shift.id" :shift="shift" class="mb-5" @editShift="editShift"/>
  </div>
</template>
<script setup lang="ts">
import type { Shift } from '~/types/shifts'

const shiftsStore = useShiftsStore()

const props = defineProps<{
  list: Shift[];
}>()
const emits = defineEmits([
  'editShift',
  'deleteShift'
])
function editShift(item: Shift){
  shiftsStore.setActiveShift({...item, type:'edit'})
  shiftsStore.shiftDialogIsOpen = true;
}

function deleteShift(item: Shift){
  emits('deleteShift', item)
}

</script>
<style scoped lang="scss"></style>
