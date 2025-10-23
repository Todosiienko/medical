<template>
    <div class="date-shift">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center pa-2">{{ dayjs(date).format('DD-MM-YYYY') }}
                <v-icon @click="deleteDateShift" class="cursor-pointer">mdi-close</v-icon></v-card-title>
            <v-card-item>
                <!-- i still need to add validation on the time fields, exlude already chosen times -->
                <v-text-field :model-value="dateShift.startTime" label="Start Time" prepend-icon="mdi-clock-time-four-outline"
                    readonly>
                    <v-menu v-model="showStartTimeMenu" :close-on-content-click="false" activator="parent" min-width="0">
                        <v-time-picker v-model="dateShift.startTime" format="24hr"></v-time-picker>
                    </v-menu>
                </v-text-field>
                <v-text-field :model-value="dateShift.endTime" label="End Time" prepend-icon="mdi-clock-time-four-outline"
                    readonly>
                    <v-menu v-model="showEndTimeMenu" :close-on-content-click="false" activator="parent" min-width="0">
                        <v-time-picker v-model="dateShift.endTime" format="24hr"></v-time-picker>
                    </v-menu>
                </v-text-field>
                <v-text-field v-model="dateShift.price" label="Price"></v-text-field>
                <v-select v-model="dateShift.type" label="Type" :items="shiftTypes"></v-select>
            </v-card-item>
        </v-card>
    </div>
</template>
<script setup>
import dayjs from 'dayjs'
const props = defineProps({
    shift: Object,
})
const emits = defineEmits(['deleteDateShift'])
const showStartTimeMenu = ref(false)
const showEndTimeMenu = ref(false)

const shiftTypes = [{title: "Consultation", value: "consultation"}, {title: "Ambulance", value: "ambulance"}, {title: "Other", value: "other"}]

const dateShift = ref({
    startTime: "",
    endTime: "",
    price: "",
    type: "",
    currency: "EUR",
})

function deleteDateShift(){
    emits('deleteDateShift', props.date)
}
onMounted(() => {
    dateShift.value = props.shift;
})

</script>
<style lang="scss" scoped>
.date-shift {
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px;
}
</style>