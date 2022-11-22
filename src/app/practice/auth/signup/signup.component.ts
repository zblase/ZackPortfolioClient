import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
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

  onSignup(){
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(this.form.value.email, this.form.value.password);
  }
}