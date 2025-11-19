<template>
    <div class="date-shift">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center pa-2">{{ dayjs(date || '').format('DD-MM-YYYY') }}
                <v-icon @click="deleteDateShift" class="cursor-pointer">mdi-close</v-icon></v-card-title>
            <v-card-item>
              <v-text-field :model-value="startTime" label="Start Time" prepend-icon="mdi-clock-time-four-outline"
                            readonly>
                <v-menu v-model="showStartTimeMenu" :close-on-content-click="false" activator="parent" min-width="0">
                  <v-time-picker v-model="startTime" @update:hour="(v)=>startTimeHour = v" :max="endTime"
                                 :allowed-hours="allowedHours" :allowed-minutes="allowedStartTimeMinutes"
                                 format="24hr"></v-time-picker>
                </v-menu>
              </v-text-field>
              <v-text-field :model-value="endTime" label="End Time" prepend-icon="mdi-clock-time-four-outline"
                            readonly>
                <v-menu v-model="showEndTimeMenu" :close-on-content-click="false" activator="parent" min-width="0">
                  <v-time-picker v-model="endTime" @update:hour="(v)=>endTimeHour = v" :allowed-hours="allowedHours"
                                 :allowed-minutes="allowedEndTimeMinutes" :min="startTime" format="24hr"></v-time-picker>
                </v-menu>
              </v-text-field>
                <v-text-field v-model="price" label="Price"></v-text-field>
                <v-select v-model="type" label="Type" :items="shiftTypes"></v-select>
            </v-card-item>
        </v-card>
    </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import {useShiftsStore} from "~/stores/shifts.js";
const props = defineProps({
    date: [String,Date],
})
const emits = defineEmits(['deleteDateShift'])
const showStartTimeMenu = ref(false)
const showEndTimeMenu = ref(false)
const startTimeHour= ref<number | null>(null);
const endTimeHour= ref<number | null>(null);
const shiftsStore = useShiftsStore();
const shiftTypes : Record<string,string>[] = [{title: "Consultation", value: "consultation"}, {title: "Ambulance", value: "ambulance"}, {title: "Telephone", value: "telephone"}]

const startTime = defineModel<string>('startTime');
const endTime = defineModel<string>('endTime');
const price = defineModel('price');
const type = defineModel('type');

function deleteDateShift():void{
    emits('deleteDateShift')
}

const allowedTime = computed(():Record<string, string[]>=>{

  const minutesRange: string[] = [];
  for(let min = 0; min<=59; min++){
    let formatedMinute = min < 10 ? "0"+min : min.toString()
    minutesRange.push(formatedMinute);
  }
  let hourRange = [];
  for(let h = 0; h<=24; h++){
    let formatedHour = h < 10 ? "0"+h : h.toString()
    hourRange.push(formatedHour);
  }
  const unitTime = Object.fromEntries(hourRange.map((h)=>[h,minutesRange]));


  if (!props.date || shiftsStore.activeShift.type === 'edit') {
    // current implementation still need to be done for edit mode so i don't restrict hours and minutes for timepicker
    return unitTime;
  }
  const passedDate = dayjs(props.date).format('YYYY-MM-DD');
  if(passedDate in shiftsStore.getBookedTime){
    const bookedTime = shiftsStore.getBookedTime[passedDate];
    bookedTime.forEach((i)=>{
      const [startHour, startMinute] = i.startTime.split(":");
      const [endHour, endMinute] = i.endTime.split(":");
      if(+startHour === +endHour){
        unitTime[startHour] = unitTime[startHour].filter((m)=> +m < +startMinute || +m > +endMinute);
      } else if(+startHour < +endHour && startMinute === '00' && endMinute === '00'){
        let hour = +startHour;
        for(hour; hour <= +endHour;hour++){
          delete unitTime[hour]
        }
      } else if(+startHour < +endHour && startMinute === '00' && endMinute !== '00'){
        let hour = +startHour;
        for(hour; hour < +endHour;hour++){
          delete unitTime[hour]
        }
        unitTime[endHour] = unitTime[endHour].filter((m)=> +m > +endMinute);
      } else if(+startHour < +endHour && startMinute !== '00' && endMinute !== '00'){
        let hour = +startHour;
        if(+endHour - +startHour >=2){
          for(hour +1; hour < +endHour;hour++){
            delete unitTime[hour]
          }
        } else {
          unitTime[startHour] = unitTime[startHour].filter((m)=> +m < +startMinute);
          unitTime[endHour] = unitTime[endHour].filter((m)=> +m > +endMinute);
        }
      }
    })
  }
  return unitTime
})
const allowedHours = computed(():number[]=>Object.keys(allowedTime.value).map((h)=>+h))
const allowedStartTimeMinutes = computed(():number[]=>{
  if(startTimeHour.value === null) return [];
  else {
    let hourKey = startTimeHour.value < 10 ? "0"+ startTimeHour.value : startTimeHour.value.toString();
    return allowedTime.value[hourKey].map((m)=>+m);
  }
})
const allowedEndTimeMinutes = computed(()=>{
  if(endTimeHour.value === null) return [];
  else {
    let hourKey = endTimeHour.value < 10 ? "0"+ endTimeHour.value : endTimeHour.value.toString();
    return allowedTime.value[hourKey].map((m)=>+m);
  }
})
</script>
<style lang="scss" scoped>
.date-shift {
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px;
}
</style>