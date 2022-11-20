import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './practice/about/about.component';
import { ImageUploadComponent } from './practice/image-upload/image-upload.component';
import { LoginComponent } from './practice/login/login.component';
import { MainPracticeComponent } from './practice/main-practice/main-practice.component';
import { PostsComponent } from './practice/posts/posts.component';
import { SignupComponent } from './practice/signup/signup.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'practice', component: MainPracticeComponent, children: [
    { path: '', redirectTo: 'about', pathMatch: 'full' },
    { path: 'posts', component: PostsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'image-upload', component: ImageUploadComponent },
    /*{ path: 'image-upload', component: ImageUploadComponent, canActivate: [AuthGuard] },*/
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
  ] },
  { path: 'calendar', component: CalendarComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
