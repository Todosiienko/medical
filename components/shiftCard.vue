<template>
    <v-card class="shiftWrapper">
        <v-card-title class="text-h5 mb-3" length="5">{{ shiftFields.type === 'new' ? 'Create' : 'Edit' }}</v-card-title>
        <form @submit.prevent="saveShift">
            <v-text-field v-model="shiftFields.title" label="Title" length="5" placeholder="Enter title"></v-text-field>
            <v-textarea v-model="shiftFields.description" label="Description" placeholder="Enter description"></v-textarea>
            <div class="dates">
                <v-date-picker multiple v-model="dates"></v-date-picker>
                <div v-for="date in dates" :key="date">
                    <dateShift :shift="shiftFields.dates[dayjs(date).format('YYYY-MM-DD')]" />
                </div>
            </div>
            <v-card-actions class="d-flex justify-end">
                <v-btn variant="flat" @click="deleteShift">Delete</v-btn>
                <v-btn color="primary" variant="flat" type="submit" :disabled="disableSave">save</v-btn>
            </v-card-actions>
        </form>
    </v-card>
</template>
<script setup>
import dayjs from 'dayjs'
import { useShiftsStore } from '@/stores'
const shiftsStore = useShiftsStore()

const props = defineProps({
    shift: Object,
    doctorsList: Array,
})

const dates = ref([]);

const emit = defineEmits(['save']);

watch(dates, (newVal) => {
    newVal.forEach(date => {
        const formatedDate = dayjs(date).format('YYYY-MM-DD');
        if(!shiftFields.value.dates[formatedDate]) {
            shiftFields.value.dates[formatedDate] = {
                id: new Date().getTime(),
                date: date,
                startTime: "",
                endTime: "",
                price: "",
                type: "",
                currency: "EUR",
            };
        }
    });
})


const shiftFields = ref({
    title: "",
    shiftDescription: "",
    dates: [],
})


function saveShift() {
    console.log(shiftFields.value);
    if(shiftFields.value.type === 'new') {
        shiftsStore.addShift({...shiftFields.value, id: new Date().getTime()});
    } else {
        shiftsStore.edditShift(shiftFields.value.id);
    }
    shiftsStore.edditShift(shiftFields.value);
    emit('closeShiftDialog');
    clearFields();
}

function deleteShift() {
    shiftsStore.deleteShift(shiftFields.value.id);
    emit('closeShiftDialog');
    clearFields();
}
const disableSave = computed(() => {
    // here i'd add some validation for the shift fields
    return !shiftFields.value.title
})
function clearFields() {
    shiftFields.value = {
        description: "",
        dates: [],
        title: "",
    }
}



onMounted(() => {
    shiftFields.value = JSON.parse(JSON.stringify(shiftsStore.activeShift));
    if(shiftFields.value.dates) {
        dates.value = Object.values(shiftFields.value.dates || {}).map(date => date.date);
    }
})
</script>
<style lang="scss" scoped></style>
