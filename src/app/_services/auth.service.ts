import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<any>(this.baseUrl + 'login', model, {
      headers: this.requestHeaders(),
      observe: 'response',
    }).map(response => {
      const user = response.body;
      if (user) {
        localStorage.setItem('token', user.tokenString);
        this.userToken = user.tokenString;
      }
    });
  }

  register(model: any) {
    return this.http.post<any>(this.baseUrl + 'register', model, {
      headers: this.requestHeaders(),
      observe: 'response',
    });
  }

  private requestHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

}
