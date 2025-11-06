import { defineStore } from 'pinia';
import groupBy from 'lodash/groupBy';

// Why are we using options API here? Could it be better to use the composition API structure?
export const useShiftsStore = defineStore('shifts', {
  state: () => ({
    activeShift: {},
    shiftDialogIsOpen: false,
    shifts: [{
      id: "1",
      title: "Title 1",
      description: "Description 1",
      dates: {"2025-11-06":{
        id:"2025-11-06",
        date: "2025-11-06",
        startTime: "10:00",
        endTime: "10:30",
        price: 100,
        type: "consultation",
        currency: "EUR",
      },"2025-11-07":{
        id:"2025-11-07",
        date: "2025-11-07",
        startTime: "10:00",
        endTime: "11:00",
        price: 100,
        type: "consultation",
        currency: "EUR",
      }},
    },{
      id: "2",
      title: "Title 2",
      description: "Description 2",
      dates: {"2025-11-07":{
        id:"2025-11-07",
        date: "2025-11-07",
        startTime: "12:00",
        endTime: "13:00",
        price: 200,
        type: "ambulance",
        currency: "EUR",
      }},
    }],
  }),
  actions: {
    setActiveShift(shift) {
      this.activeShift = shift;
    },
    addShift(shift) {
      this.shifts.push(shift);
    },
    editShift(shift) {
      this.shifts = this.shifts.map(item => item.id === shift.id ? shift : item);

    },
    deleteShift(shiftId) {
      this.shifts = this.shifts.filter(item => item.id !== shiftId);
    },
    clearActiveShift() {
      this.activeShift = {};
    },
  },
  getters: {
    priceOptions: (state) => {
      // could we improve this having a min Heap and a max Heap? How could be the idea of the implementation?
      const prices = [];
      state.shifts.forEach(shift => {
        Object.values(shift.dates).forEach(date => {
          prices.push(date.price);
        });
      });
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    },
    getBookedTime:(state)=>{
      // Is this code doing the same as the previous one? Could you explain it to me?
      const allDateShifts = state.shifts.flatMap(shift =>
        Object.values(shift.dates).map(({ id, date, startTime, endTime, type }) => ({
          id,
          date,
          startTime,
          endTime,
          type,
        }))
      );

      return groupBy(allDateShifts, 'date');
    }
  }
});