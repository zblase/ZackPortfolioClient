import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogEditPost } from './practice/posts/posts.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MainPracticeComponent } from './practice/main-practice/main-practice.component';
import { PostsComponent } from './practice/posts/posts.component';
import { AboutComponent } from './practice/about/about.component';
import { ImageUploadComponent } from './practice/image-upload/image-upload.component';
import { LoginComponent } from './practice/auth/login/login.component';
import { SignupComponent } from './practice/auth/signup/signup.component';
import { CalendarDayComponent } from './calendar/calendar-day/calendar-day.component';
import { CalendarDialogComponent } from './calendar/calendar-dialog/calendar-dialog.component';
import { ImageDialogComponent } from './home/image-dialog/image-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CalendarComponent,
    MainPracticeComponent,
    PostsComponent,
    DialogEditPost,
    AboutComponent,
    ImageUploadComponent,
    LoginComponent,
    SignupComponent,
    CalendarDayComponent,
    CalendarDialogComponent,
    ImageDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatRippleModule,
    MatSidenavModule,
    MatTreeModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
