<template>
  <div class="container">
    <div class="filter w-100">
      <h3>Filter</h3>
        <v-range-slider thumb-label="always" v-model="priceRange" :min="shiftsStore.priceOptions.min" :max="shiftsStore.priceOptions.max" step="1" label="Filter on price" class="w-100">
          <template v-slot:prepend>
            {{ shiftsStore.priceOptions.min }}
        </template>
        <template v-slot:append>
          {{ shiftsStore.priceOptions.max }}
        </template>
      </v-range-slider>
    </div>
    <div class="actions d-flex justify-space-between align-center w-100">
      <h3>Shifts</h3> <v-btn @click='setNewShift'>add shift</v-btn>
    </div>
    <div class="shifts-list">
      <shiftsList :list="filteredShifts" />
    </div>
    <v-dialog v-model="shiftsStore.shiftDialogIsOpen" transition="slide-x-reverse-transition"
      content-class="dialog-right" max-width="600" @afterLeave="clearShift">
      <v-card class="shift-card">
        <v-card-title>
          <div class="d-flex justify-end">
            <v-icon @click="shiftsStore.shiftDialogIsOpen = false">mdi-close</v-icon>
          </div>
        </v-card-title>
        <v-card-item>
          <shiftCard @closeShiftDialog="shiftsStore.shiftDialogIsOpen = false" />
        </v-card-item>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="js">
const shiftsStore = useShiftsStore()

const priceRange = ref([shiftsStore.priceOptions.min, shiftsStore.priceOptions.max]);

const newShiftData = {
  title: "",
  description: "",
  dates: {},
  type: "new",
}

watch(() => shiftsStore.priceOptions, (newVal, oldVal) => {
  priceRange.value = [newVal.min, newVal.max];
});

function setNewShift() {
  shiftsStore.shiftDialogIsOpen = true;
  shiftsStore.setActiveShift(newShiftData);
}

function clearShift() {
  shiftsStore.clearActiveShift();
}

const filteredShifts = computed(()=>{
  const [min, max] = priceRange.value;
  return shiftsStore.shifts.reduce((acc, shift) => {
    const validDates = Object.values(shift.dates).filter(({ price }) => {
      const p = Number(price);
      return p >= min && p <= max;
    });
    if (validDates.length > 0) {
      acc.push({
        ...shift,
        dates: Object.fromEntries(validDates.map(d => [d.id, d])),
      });
    }
    return acc},[])
})

</script>
<style scoped lang="scss">

.container {
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .shifts-list {
    width: 100%;
    min-width: 500px;
    height: 60vh;
    max-width: 1000px;
    padding: 20px;
    margin: 15px;
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