import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { CalendarEvent } from "./calendar-event.model";

@Injectable({providedIn: 'root'})
export class CalendarService {

  constructor(private http: HttpClient) {}

  private events: CalendarEvent[] = [];
  private eventsUpdated = new Subject<CalendarEvent[]>();
  private newEvent = new Subject<CalendarEvent | Error>();

  getEvents() {
    this.http.get<{events: any}>('http://localhost:3000/api/calendar')
      .pipe(map((eventData) => {
        console.log(eventData);
        return eventData.events.map((event: { start: { dateTime: string | number | Date; }; end: { dateTime: string | number | Date; }; summary: any; }) => {
          const sDate = new Date(event.start.dateTime);
          sDate.setSeconds(0);
          const eDate = new Date(event.end.dateTime);
          eDate.setSeconds(0);
          return {
            summary: event.summary,
            start: {dateTime: sDate},
            end: {dateTime: eDate},
          }
        });
      }))
      .subscribe(transformedEvents => {
        this.events = transformedEvents;
        this.eventsUpdated.next([...this.events]);
      });
  }

  getEventListener() {
    return this.eventsUpdated.asObservable();
  }

  getNewEventListener() {
    return this.newEvent.asObservable();
  }

  createEvent(event: CalendarEvent, files: File[]) {
    const formData = new FormData();

    formData.append('event', JSON.stringify(event));
    for (let file of files) {
      formData.append('files', file);
    }

    this.http.post<{message: string, event: any}>('http://localhost:3000/api/calendar', formData)
      .subscribe(res => {
        this.newEvent.next(event);
        this.events.push(event);
        this.eventsUpdated.next([...this.events]);
      })
  }
}