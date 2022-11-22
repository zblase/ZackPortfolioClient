import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authListenerSubs!: Subscription;
  userAuthenticated = false;
  form!: FormGroup;
  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      'email': new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      'password': new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.form.setValue({
      'email': '',
      'password': ''
    });
  }

  ngOnDestroy() {
      this.authListenerSubs.unsubscribe();
  }

  onLogin(){
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(this.form.value.email, this.form.value.password);
  }

  onLogout() {
    this.authService.logout();
  }
}