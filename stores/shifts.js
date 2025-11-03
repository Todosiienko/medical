import { defineStore } from 'pinia';

export const useShiftsStore = defineStore('shifts', {
  state: () => ({
    activeShift: {},
    shiftDialogIsOpen: false,
    shifts: [{
      id: "1",
      title: "Title 1",
      description: "Description 1",
      dates: {"2025-01-01":{
        id:"2025-01-01",
        date: "2025-01-01",
        startTime: "10:00",
        endTime: "11:00",
        price: 100,
        type: "consultation",
        currency: "EUR",
      },"2025-01-02":{
        id:"2025-01-02",
        date: "2025-01-02",
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
      dates: {"2025-01-02":{
        id:"2025-01-02",
        date: "2025-01-02",
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
    edditShift(shift) {
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
  }
});