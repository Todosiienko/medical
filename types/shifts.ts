export interface DateShift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  type: string;
  currency: string;
}

export interface Shift {
  id: string;
  title: string;
  description: string;
  dates: Record<string, DateShift>;
  type?: string;
}

export interface BookedTime {
  id:string;
  type:string;
  date:string;
  startTime:string;
  endTime:string;
}