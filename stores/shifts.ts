import {defineStore} from 'pinia';
import type {BookedTime, Shift} from '~/types/shifts';

function groupBy(array: BookedTime[], key: keyof BookedTime): Record<string, BookedTime[]> {
    return array.reduce((result: Record<string, BookedTime[]>, item:BookedTime) => {
        const groupKey = item[key] as string;
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

const initialTestShiftData: Shift[] = [{
    id: "1",
    title: "Title 1",
    description: "Description 1",
    dates: {
        "2025-11-06": {
            id: "2025-11-06",
            date: "2025-11-06",
            startTime: "10:00",
            endTime: "10:30",
            price: 100,
            type: "consultation",
            currency: "EUR",
        }, "2025-11-07": {
            id: "2025-11-07",
            date: "2025-11-07",
            startTime: "10:00",
            endTime: "11:00",
            price: 100,
            type: "consultation",
            currency: "EUR",
        }
    },
}, {
    id: "2",
    title: "Title 2",
    description: "Description 2",
    dates: {
        "2025-11-07": {
            id: "2025-11-07",
            date: "2025-11-07",
            startTime: "12:00",
            endTime: "13:00",
            price: 200,
            type: "ambulance",
            currency: "EUR",
        }
    },
}]

export const useShiftsStore = defineStore('shifts', () => {

    const activeShift = ref<Shift>({} as Shift);
    const shiftDialogIsOpen = shallowRef(false);
    const shifts = ref<Shift[]>(initialTestShiftData)

    function setActiveShift(shift: Shift): void {
        activeShift.value = shift;
    }

    function addShift(shift: Shift):void {
        shifts.value.push(shift);
    }

    function editShift(shift: Shift):void {
        shifts.value = shifts.value.map(item => item.id === shift.id ? shift : item);
    }

    function deleteShift(shiftId: string):void {
        shifts.value = shifts.value.filter(item => item.id !== shiftId);
    }

    function clearActiveShift():void {
        activeShift.value = {} as Shift;
    }

    const priceOptions = computed((): { max: number, min: number } => {
        const prices: number[] = [];
        shifts.value.forEach(shift => {
            Object.values(shift.dates).forEach(date => {
                prices.push(date.price);
            });
        });
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    })
    const getBookedTime = computed(() : Record<string, BookedTime[]>=> {
        const allDateShifts = shifts.value.flatMap(shift =>
            Object.values(shift.dates).map(({id, date, startTime, endTime, type}) => ({
                id,
                date,
                startTime,
                endTime,
                type,
            }))
        );
        return groupBy(allDateShifts, 'date');
    })
    return {
      activeShift, shiftDialogIsOpen, shifts, setActiveShift,addShift,editShift,deleteShift,clearActiveShift,priceOptions, getBookedTime
    }
});