<template>
    <v-card class="shiftWrapper">
        <v-card-title class="text-h5 mb-3" length="5">{{ shiftFields.type === 'new' ? 'Create' : 'Edit'
            }}</v-card-title>
        <form @submit.prevent="saveShift">
            <v-text-field v-model.trim="shiftFields.title" label="Title" length="5" placeholder="Enter title" clearable
                :rules="[rules.titleValidation]"></v-text-field>
            <v-textarea v-model.trim="shiftFields.description" label="Description" placeholder="Enter description"
                clearable :rules="[rules.descriptionValidation]"></v-textarea>
            <div class="dates">
                <v-date-picker multiple v-model="dates" title="Select 1-10 dates"></v-date-picker>
                <div v-if="dateSelectionNotification" class="text-error mt-2">{{ dateSelectionNotification }}</div>
                <div v-for="date in dates" :key="date">
                    <dateShift :date="date" v-model:startTime="shiftFields.dates[dayjs(date).format('YYYY-MM-DD')].startTime"
                        v-model:endTime="shiftFields.dates[dayjs(date).format('YYYY-MM-DD')].endTime"
                        v-model:price="shiftFields.dates[dayjs(date).format('YYYY-MM-DD')].price"
                        v-model:type="shiftFields.dates[dayjs(date).format('YYYY-MM-DD')].type"
                        @deleteDateShift="deleteDateShift(date)" />
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
const shiftsStore = useShiftsStore()
const emit = defineEmits(['closeShiftDialog', 'save']);
const props = defineProps({
    shift: Object,
})

const rules = {
    titleValidation: value => {
        if (value && value.length <= 100) return true;
        if(value && value.length > 100) return 'Title must be less than 100 characters';
        return 'You must enter a title';
    },
    descriptionValidation: value => {
        if (!value || (value?.length <= 500)) return true;
        if(value?.length > 500) return 'Description must be less than 500 characters';
    },
}
const dates = ref([]);
const dateSelectionNotification = shallowRef('');


watch(dates, (newVal, oldVal) => {
    dateSelectionNotification.value = '';
    
    if (newVal.length === 0) {
        dateSelectionNotification.value = 'Please select at least 1 date';
        return;
    }
    if(newVal.length===10){
        dateSelectionNotification.value = 'Maximum of 10 dates allowed';
    }
    if (newVal.length > 10) {
        dates.value = newVal.slice(0, 10);
        return;
    }
    
    newVal.forEach(date => {
        const formatedDate = dayjs(date).format('YYYY-MM-DD');
        if(!shiftFields.value.dates[formatedDate]) {
            shiftFields.value.dates[formatedDate] = {
                id: formatedDate,
                date: formatedDate,
                startTime: "",
                endTime: "",
                price: "0",
                type: "telephone",
                currency: "EUR",
            };
        }
    });
})

const shiftFields = ref({
    title: "",
    description: "",
    dates: {},
})


function deleteDateShift(date) {
    delete shiftFields.value.dates[dayjs(date).format('YYYY-MM-DD')];
    dates.value = dates.value.filter(d => d !== date);
    dateSelectionNotification.value = '';
}

function saveShift() {
    if(shiftFields.value.type === 'new') {
        delete shiftFields.value.type;
        shiftsStore.addShift({...shiftFields.value, id: new Date().getTime()});
    } else {
        shiftsStore.editShift(shiftFields.value);
    }
    emit('closeShiftDialog');
    clearFields();
}

function deleteShift() {
    shiftsStore.deleteShift(shiftFields.value.id);
    emit('closeShiftDialog');
    clearFields();
}
const disableSave = computed(() => {
    const titleIsValid = typeof(rules.titleValidation(shiftFields.value.title)) === 'boolean' && rules.titleValidation(shiftFields.value.title);
    const descriptionIsValid = typeof(rules.descriptionValidation(shiftFields.value.description)) === 'boolean' && rules.descriptionValidation(shiftFields.value.description);
    const datesAreValid = dates.value.length >= 1 && dates.value.length <= 10;
    return !titleIsValid || !descriptionIsValid || !datesAreValid;
})
function clearFields() {
    shiftFields.value = {
        description: "",
        dates: {},
        title: "",
    }
}



onMounted(() => {
    shiftFields.value = JSON.parse(JSON.stringify(shiftsStore.activeShift));
    if(!shiftFields.value.dates) {
        shiftFields.value.dates = {};
    }
    if(shiftFields.value.dates && Object.keys(shiftFields.value.dates).length > 0) {
        dates.value = Object.values(shiftFields.value.dates).map(date => date.date);
    }
})
</script>
<style lang="scss" scoped></style>
