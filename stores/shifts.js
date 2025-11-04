import { defineStore } from 'pinia';

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
      const uniqDates = new Set();
      let allDateShifts = [];
      state.shifts.forEach(shift => {
        Object.keys(shift.dates).forEach(key => {
          uniqDates.add(key);
        });
        const modifiedDates = Object.values(shift.dates).map((i)=>{
          return {
            id:i.id,
            date:i.date,
            startTime:i.startTime,
            endTime:i.endTime,
            type:i.type
          }
        })
        allDateShifts = [...allDateShifts, ...modifiedDates];
      });

      const separateShifts = Object.fromEntries([...uniqDates].map((i)=>{
        const key = i;
        const filteredShifts = allDateShifts.filter((shift)=>shift.date === key);
        return [key, filteredShifts]
      }))
      return separateShifts;
    }
  }
});