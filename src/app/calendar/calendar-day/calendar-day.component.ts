import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarDay } from '../calendar-day.model';
import { CalendarEvent } from '../calendar-event.model';


type TimeSlot = {
  time: number;
  class: string;
  start: number;
  end: number;
}


@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.css']
})
export class CalendarDayComponent implements OnInit, OnChanges {

  @Input() day!: CalendarDay;
  @Input() index!: number;
  @Input() showDay!: boolean;

  now = new Date();
  timeSlots: string[] = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  times: number[] = [];
  slots: TimeSlot[] = [];
  dayName: string = '';

  constructor() { }

  ngOnInit() {
    this.setDayName();

    this.times = [];
    const hrOffset = this.now.getTimezoneOffset() / 60;
    for (let i = 16; i <= 26; i++) {
      const time = (i - hrOffset) % 24;
      this.times.push(time);
      this.times.push(time + 0.25);
      this.times.push(time + 0.5);
      this.times.push(time + 0.75);
    }

    this.populateSlots();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.day.events?.sort((a, b) => a.start.dateTime.getTime() - b.start.dateTime.getTime());

    this.populateSlots();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setDayName();
  }

  setDayName() {
    this.dayName = this.days[this.day.date.getDay()];

    if (window.innerWidth < 1400 && window.innerWidth > 1175) {
      this.dayName = this.dayName.substring(0, 3);
    }
  }

  populateSlots() {

    if (this.day.events && this.day.events.length > 0) {
      this.renderEvents();
    }
    else {
      this.createEmptyDay();
    }
  }

  createEmptyDay() {
    this.slots = [];
    const hrOffset = this.now.getTimezoneOffset() / 60;
    for (let i = 16; i <= 26; i++) {
      const time = (i - hrOffset) % 24;
      this.slots.push({ time: time, start: i - 15, end: i - 14, class: 'time-border' });
    }
  }

  renderEvents() {
    this.slots = [];
    let currStart: number | null = null;
    let currEventIndex: number = 0;

    for (let i = 1; i <= this.times.length; i++) {
      const t = this.times[i - 1];

      if (!!currStart) {
        if (t >= this.formatEventTime(this.day.events[currEventIndex].end.dateTime)) {
          if (this.day.events.length - 1 == currEventIndex || this.day.events[currEventIndex].end.dateTime.getTime() != this.day.events[currEventIndex + 1].start.dateTime.getTime() || this.day.events[currEventIndex + 1].summary == 'New Event' || this.day.events[currEventIndex].summary == 'New Event') {
            this.slots.push({
              time: this.times[currStart - 1],
              start: currStart,
              end: i,
              class: (this.day.events[currEventIndex]).new ? 'new-event' : 'busy-event'
            });
  
            currStart = null;
            i--;
          }
          
          currEventIndex++;
        }
      }
      else if (currEventIndex < this.day.events.length && t >= this.formatEventTime(this.day.events[currEventIndex].start.dateTime)) {
        currStart = i;
      }
      else {
        this.slots.push({
          time: t,
          class: t % 1 == 0 ? 'time-border' : '',
          start: i,
          end: i + 1
        });
      }
    }
  }

  formatEventTime(time: Date): number {
    return time.getHours() + (time.getMinutes() / 60);
  }

  getSlotTime() {
    const newEvent = this.day.events.find(e => e.new == true);
    const start = new Date(newEvent!.start.dateTime);
    const end = new Date(newEvent!.end.dateTime);

    return this.removeSeconds(start.toLocaleTimeString()) + ' - ' + this.removeSeconds(end.toLocaleTimeString());
  }

  removeSeconds(time: string) {
    time = time.substring(0, time.lastIndexOf(':')) + time.substring(time.length - 3, time.length);
    return time;
  }
}