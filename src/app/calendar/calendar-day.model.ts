import { CalendarEvent } from "./calendar-event.model";

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  //newEvent?: CalendarEvent;
}