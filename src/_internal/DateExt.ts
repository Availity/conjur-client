export interface DateUnits {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export class DateExt extends Date {
  get date() {
    return this.getDate();
  }
  
  set date(value: number) {
    this.setDate(value);
  }
  
  static dateMath(dt: Date | string | number = Date.now(), units: DateUnits = {}): DateExt {
    if (dt instanceof DateExt) return dt.dateMath(units);
    
    return new DateExt(dt).dateMath(units);
  }
  
  dateMath(units: DateUnits = {}): this {
    const { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = units;
    const { year, month, date, hours: h, minutes: m, seconds: s, milliseconds: ms } = this;
    
    this.milliseconds = ms + milliseconds;
    this.seconds = s + seconds;
    this.minutes = m + minutes;
    this.hours = h + hours;
    this.date = date + days;
    this.month = month + months;
    this.year = year + years;
    return this;
  }
  
  get dayOfWeek(): number {
    return this.getDay();
  }
  
  get dayOfYear(): number {
    const start = new Date(this.year, 0, -1);
    const diff = this.valueOf() - start.valueOf();
    // 1000ms * 60s * 60m * 24h => 86400000ms per day
    return Math.floor(diff / 86_400_000);
  }
  
  get hours(): number {
    return this.getHours();
  }
  
  set hours(value: number) {
    this.setHours(value);
  }
  
  get milliseconds(): number {
    return this.getMilliseconds();
  }
  
  set milliseconds(value: number) {
    this.setMilliseconds(value);
  }
  
  get minutes(): number {
    return this.getMinutes();
  }
  
  set minutes(value: number) {
    this.setMinutes(value);
  }
  
  get month(): number {
    return this.getMonth() + 1;
  }
  
  set month(value: number) {
    this.setMonth(value - 1);
  }
  
  get seconds(): number {
    return this.getSeconds();
  }
  
  set seconds(value: number) {
    this.setSeconds(value);
  }
  
  get time(): number {
    return this.getTime();
  }
  
  set time(value: number) {
    this.setTime(value);
  }
  
  get year(): number {
    return this.getFullYear();
  }
  
  set year(value: number) {
    this.setFullYear(value);
  }
}
