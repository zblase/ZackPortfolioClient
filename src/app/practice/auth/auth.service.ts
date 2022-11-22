import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

import { AuthData } from './auth-data.model'

const URL = environment.apiUrl + "/user/"

@Injectable({ providedIn: 'root' })
export class AuthService {

  private token?: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId?: string;

  constructor(private http: HttpClient, private router: Router) {

  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(URL + 'signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(URL+'login', authData)
      .subscribe(response => {
        this.token = response.token;

        if (response.token) {
          const expDuration = response.expiresIn * 1000;
          this.setAuthTimer(expDuration);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = response.userId;

          const now = new Date();
          const expDate = new Date(now.getTime() + expDuration);
          this.saveAuthData(response.token, expDate, response.userId);

          this.router.navigate(['/practice/image-upload']);
        }
      });
  }

  autoAuthUser() {
    const authData = this.getAuthData();

    if (!authData) {
      return;
    }

    const now = new Date();
    const expiresIn = authData.expDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authData.token;
      this.isAuthenticated = true;
      this.userId = authData.userId!
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = undefined;
    this.clearAuthData();

    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/practice/login']);
    }, duration);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expDate) {
      return;
    }

    return {
      token: token,
      expDate: new Date(expDate),
      userId: userId
    }
  }
}