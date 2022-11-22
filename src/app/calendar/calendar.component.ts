//import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { Observable, Subscription } from 'rxjs';
//import { fileType } from '../practice/image-upload/file-type.validator';
import { CalendarDay } from './calendar-day.model';
import { CalendarEvent } from './calendar-event.model';
import { CalendarService } from './calendar.service';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';


enum CalendarType {
  Day = 0,
  Week = 1,
  Month = 2
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {

  @ViewChild('startMenu', { static: true })
  startMenu!: MatMenu;

  form!: FormGroup;
  calType: CalendarType = CalendarType.Week;
  calDays: CalendarDay[] = [];
  today: Date = new Date();
  files: File[] = [];
  private eventsSub!: Subscription;
  events: CalendarEvent[] = [];

  monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  currDays: string[] = [];
  currStart: Date = new Date();
  currEvents: CalendarEvent[] = [];

  hours: number[] = [];
  minutes: string[] = ['00', '15', '30', '45'];

  loading = true;


  constructor(private calendarService: CalendarService, public dialog: MatDialog) { }

  ngOnInit() {
    this.calendarService.getEvents();
    this.eventsSub = this.calendarService.getEventListener().subscribe((events: CalendarEvent[]) => {
      this.events = events;
      this.resetCurrentStart();
      this.loading = false;
    });

    //valid scheduling times range from 16:00 to 3:00 UTC
    this.hours = [];
    const hrOffset = this.currStart.getTimezoneOffset() / 60;
    for (let i = 16; i <= 26; i++) {
      const time = (i - hrOffset) % 24;
      this.hours.push(time);
    }

    this.form = new FormGroup({
      'firstName': new FormControl(null, {
        validators: [Validators.required]
      }),
      'lastName': new FormControl(null, {
        validators: [Validators.required]
      }),
      'number': new FormControl(null, {}),
      'email': new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      'details': new FormControl(null, {}),
      'attachments': new FormControl(null, {}),
      'date': new FormControl(null, {
        validators: [Validators.required]
      }),
      'startTime': new FormControl(null, {
        validators: [Validators.required]
      }),
      'endTime': new FormControl({ value: null, disabled: true }, {
        validators: [Validators.required],
      }),
    });

    this.form.setValue({
      'firstName': '',
      'lastName': '',
      'number': '',
      'email': '',
      'details': '',
      'attachments': null,
      'date': new Date(),
      'startTime': null,
      'endTime': null
    });

    this.form.get('startTime')?.statusChanges.subscribe((status) => {
      if (status == 'VALID') {
        this.form.get('endTime')?.enable();
      }
      else {
        this.form.get('endTime')?.reset();
        this.form.get('endTime')?.disable();
      }
    });

    this.form.get('date')?.valueChanges.subscribe((value) => {
      const sTime = this.form.get('startTime')?.value;
      const eTime = this.form.get('endTime')?.value;
      if (sTime) {
        sTime.setDate(value.getDate());
        sTime.setMonth(value.getMonth());
        sTime.setFullYear(value.getFullYear());
      }
      if (eTime) {
        eTime.setDate(value.getDate());
        eTime.setMonth(value.getMonth());
        eTime.setFullYear(value.getFullYear());
      }
      if (this.form.get('startTime')?.value) {
        this.renderNewEvent();
      }
      else {
        this.form.patchValue({ 'startTime': null });
        this.form.patchValue({ 'endTime': null });
      }

      this.currEvents = this.events.filter(e => e.start.dateTime.getDate() == value.getDate() && e.start.dateTime.getMonth() == value.getMonth());
      this.currStart = value;
      if (!this.calDays.find(d => d.date.getDate() == value.getDate() && d.date.getMonth() == value.getMonth())) {
        this.populateDays();
      }
    });
    this.form.get('startTime')?.valueChanges.subscribe((value) => {
      if (value) {
        this.validateTime();
      }

    });
    this.form.get('endTime')?.valueChanges.subscribe((value) => {
      if (value) {
        this.validateTime();
      }
    });
  }

  ngOnDestroy(): void {
    this.eventsSub.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    if (window.innerWidth < 1175 && this.calType != 0) {
      this.calType = 0;
      this.populateDays();
    }
  }

  validateTime() {
    const sTime = this.form.get('startTime')?.value as Date;
    const eTime = this.form.get('endTime')?.value as Date || new Date(sTime);

    if (sTime && sTime >= eTime) {
      eTime.setHours(sTime.getHours());
      eTime.setMinutes(sTime.getMinutes() + 30);
      this.form.patchValue({ 'endTime': eTime });
    }
    else if (sTime && eTime) {
      this.renderNewEvent();
    }
  }

  renderNewEvent() {
    const date = new Date(this.form.get('date')?.value);
    const sTime = this.form.get('startTime')?.value as Date;
    const eTime = this.form.get('endTime')?.value as Date || new Date(sTime);

    const newEvent = {
      summary: 'New Event',
      start: {
        dateTime: sTime
      },
      end: {
        dateTime: eTime
      },
      new: true
    }

    this.populateDays();
    this.calDays.forEach(d => d.events?.filter(e => !e.new));
    let selDate = this.calDays.find(d => {
      return d.date.toDateString() == date.toDateString();
    })!;
    const index = this.calDays.indexOf(selDate);
    selDate.events?.push(newEvent);

    this.calDays[index] = { date: selDate.date, events: selDate.events };
  }

  populateDays() {
    this.calDays = [];

    if (window.innerWidth < 1175 && this.calType != 0) {
      this.calType = 0;
    }

    switch (this.calType) {
      case 0:
        this.currDays = [this.days[this.currStart.getDay()]];
        const events = this.events.filter(e => e.start.dateTime.getFullYear() == this.currStart.getFullYear() && e.start.dateTime.getMonth() == this.currStart.getMonth() && e.start.dateTime.getDate() == this.currStart.getDate());
        this.calDays.push({
          date: this.currStart,
          events: events
        })
        break;
      case 1:
        this.currDays = this.days;

        const wDay = new Date(this.currStart);
        wDay.setDate(this.currStart.getDate() - this.currStart.getDay());

        for (let i = 0; i < 7; i++) {
          const events = this.events.filter(e => e.start.dateTime.getFullYear() == wDay.getFullYear() && e.start.dateTime.getMonth() == wDay.getMonth() && e.start.dateTime.getDate() == wDay.getDate());

          this.calDays.push({
            date: new Date(wDay),
            events: events
          });

          wDay.setDate(wDay.getDate() + 1);
        }
        break;
      case 2:
        this.currDays = this.days;

        this.currStart.setDate(1);
        const mDay = new Date(this.currStart);
        mDay.setDate(this.currStart.getDate() - this.currStart.getDay());

        while ((mDay.getMonth() <= this.currStart.getMonth() && this.currStart.getMonth() - mDay.getMonth() <= 1) || mDay.getDay() != 0) {
          const events = this.events.filter(e => e.start.dateTime.getFullYear() == mDay.getFullYear() && e.start.dateTime.getMonth() == mDay.getMonth() && e.start.dateTime.getDate() == mDay.getDate());
          this.calDays.push({
            date: new Date(mDay),
            events: events
          });

          mDay.setDate(mDay.getDate() + 1);
        }
        break;
    }
  }

  resetCurrentStart() {
    this.currStart = new Date();
    this.currEvents = this.events.filter(e => e.start.dateTime.getDate() == this.currStart.getDate() && e.start.dateTime.getMonth() == this.currStart.getMonth());

    this.populateDays();
  }

  offsetCalendar(multiplier: number) {
    console.log(this.currStart)
    switch (this.calType) {
      case 0:
        this.currStart.setDate(this.currStart.getDate() + 1 * multiplier);
        break;
      case 1:
        this.currStart.setDate(this.currStart.getDate() + 7 * multiplier);
        break;
      case 2:
        this.currStart.setMonth(this.currStart.getMonth() + 1 * multiplier);
        break;
    }

    this.populateDays();
  }

  formatTime(hour: number, minute?: string) {
    let result = '';
    const suffix = hour > 11 ? 'PM' : 'AM';
    let normHour = hour === 12 ? 12 : hour % 12;
    result = normHour.toString();

    if (!!minute && minute.length > 0) {
      result += ':' + minute;
    }

    result += ' ' + suffix;
    return result;
  }

  isHourDisabled(hour: number, start: boolean = false) {

    if (start) {
      if (this.events.find(e =>
        e.start.dateTime.getDate() == this.currStart.getDate() &&
        e.start.dateTime.getMonth() == this.currStart.getMonth() &&
        e.start.dateTime.getHours() < hour &&
        e.end.dateTime.getHours() > hour)) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (this.form.get('endTime')?.enabled) {
      let disabled = true;
      this.minutes.forEach(m => {
        if (!this.isMinuteDisabled(hour, m, false)) {
          disabled = false;
        }
      });

      return disabled;
    }
    else {
      return false;
    }
  }

  isMinuteDisabled(hour: number, minute: string, start: boolean = false) {

    const date = this.form.get('date')?.value;
    date.setHours(hour);
    date.setMinutes(parseInt(minute));

    const now = new Date();
    if (now.getTime() >= date.getTime()) {
      return true;
    }

    if (start) {
      if (this.currEvents.find(e => e.start.dateTime.getTime() <= date.getTime() && e.end.dateTime.getTime() > date.getTime())) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      const sTime = this.form.get('startTime')?.value;
      const nextStart = this.currEvents.find(e => e.start.dateTime.getTime() > sTime.getTime());

      if (date.getTime() <= sTime.getTime()) {
        return true;
      }
      else if (nextStart && nextStart.start.dateTime.getTime() < date.getTime()) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  patchTime(time: string, hour: number, minute: string) {
    const date = new Date(this.form.get('date')?.value);
    date.setHours(hour);
    date.setMinutes(parseInt(minute));

    this.form.patchValue({ [time]: date });
  }

  getButtonTime(time: string) {
    const timeVal = this.form.get(time)?.value as Date;

    if (!timeVal) {
      return 'Select Time...';
    }

    let result = timeVal.toLocaleTimeString();
    result = result.substring(0, result.lastIndexOf(':')) + result.substring(result.length - 3, result.length);

    return result;
  }

  onCreateEvent() {

    if (this.form.invalid) {
      return;
    }

    const date = this.form.get('date')?.value;
    const start = this.form.get('startTime')?.value;
    const end = this.form.get('endTime')?.value;

    start.setFullYear(date.getFullYear());
    start.setMonth(date.getMonth());
    start.setDate(date.getDate());

    end.setFullYear(date.getFullYear());
    end.setMonth(date.getMonth());
    end.setDate(date.getDate());

    const newEvent: CalendarEvent = {
      summary: this.form.get('firstName')?.value + ' ' + this.form.get('lastName')?.value + ' & Zack Blase',
      description: this.form.get('details')?.value,
      start: {
        dateTime: start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      attendees: [{
        email: this.form.get('email')?.value,
        displayName: this.form.get('firstName')?.value + ' ' + this.form.get('lastName')?.value,
        organizer: true,
        responseStatus: 'needsAction',
        comment: this.form.get('number')?.value
      }],
    }

    this.calendarService.createEvent(newEvent, this.files);
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      data: newEvent,
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.form.setValue({
        'firstName': '',
        'lastName': '',
        'number': '',
        'email': '',
        'details': '',
        'attachments': null,
        'date': new Date(),
        'startTime': null,
        'endTime': null
      });

      this.files = [];

      this.populateDays();
    });
  }

  onFilePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.files.push.apply(this.files, Array.from(files!));
  }

  getFileIcon(file: File): string {
    let src = '../assets/file.svg';
    const ext = file.name.split('.').pop();

    switch (ext) {
      case 'doc':
      case 'docx':
        src = '../assets/word.svg';
        break;
      case 'xlsx':
      case 'xlsm':
      case 'xlsb':
        src = '../assets/excel.svg';
        break;
      case 'exe':
        src = '../assets/exe.svg';
        break;
      case 'pages':
        src = '../assets/pages.svg';
        break;
      case 'pdf':
        src = '../assets/pdf.svg';
        break;
      case 'pptx':
      case 'pptm':
      case 'ppt':
        src = '../assets/ppt.svg';
        break;
      case 'txt':
        src = '../assets/txt.svg';
        break;
      case 'zip':
        src = '../assets/zip.svg';
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'svg':
        src = '../assets/image.svg';
        break;
    }

    return src;
  }

  onFileRemoved(file: File) {
    const index = this.files.indexOf(file);
    this.files.splice(index, 1);
  }
}