import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CalendarEvent } from '../calendar-event.model';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.css']
})
export class CalendarDialogComponent implements OnInit, OnDestroy {

  loading = true;
  private eventSub!: Subscription;
  newEvent!: CalendarEvent;
  dateTime: string = '';

  constructor(public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: CalendarEvent, private calendarService: CalendarService) { }

  ngOnInit() {
    /*this.eventSub = this.calendarService.getNewEventListener().subscribe((event: CalendarEvent) => {
      this.newEvent = event;
      this.formatDateTime();
      this.loading = false;
    });*/


    this.eventSub = this.calendarService.getNewEventListener().subscribe((ev) => {
      this.newEvent = ev as CalendarEvent;
      this.formatDateTime();
      this.loading = false;
    })
    

  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }

  formatDateTime() {

    let sTime = this.newEvent.start.dateTime.toLocaleTimeString();
    sTime = sTime.substring(0, sTime.lastIndexOf(':')) + sTime.substring(sTime.length - 3);
    let eTime = this.event.end.dateTime.toLocaleTimeString();
    eTime = eTime.substring(0, eTime.lastIndexOf(':')) + eTime.substring(eTime.length - 3);
    this.dateTime = sTime + ' - ' + eTime + ', &nbsp;' + this.event.start.dateTime.toLocaleDateString();

  }
}
