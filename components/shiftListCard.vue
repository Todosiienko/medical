<template>
  <div>
    <v-card class="" min-width="500px">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ shift.title }}
        <v-btn icon="mdi-pencil" @click="editShift" variant="text"></v-btn>
      </v-card-title>
      <v-card-text>
        <div class="mb-4" v-if="shift.description">{{ shift.description }}</div>
        <div class="mb-2">
          <h3 class="date-title">Dates</h3>
          <span v-if="!dates.length">No dates were added yet</span>
          <template v-else>
            <v-table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Type</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="date in dates" :key="date.id">
                  <td>{{ dayjs(date.date).format('YYYY-MM-DD') }}</td>
                  <td>{{ date.startTime }}</td>
                  <td>{{ date.endTime }}</td>
                  <td>{{ types[date.type] }}</td>
                  <td>{{ currencies[date.currency]}} {{ date.price }}</td>
                </tr>
              </tbody>
            </v-table>
          </template>
        </div>
      </v-card-text>

    </v-card>
  </div>
</template>
<script setup>
import dayjs from 'dayjs'
const props = defineProps({
  shift: Object,
})

const types = {
  "consultation": "Consultation",
  "ambulance": "Ambulance",
  "other": "Other",
}

const dates = computed(() => {
  return Object.values(props.shift.dates || {});
})

const currencies = {
    "EUR": "€",
    "USD": "$",
}

const emits = defineEmits(['editShift']);
function editShift(){
  emits('editShift', props.shift);
}
</script>