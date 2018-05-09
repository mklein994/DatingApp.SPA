import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
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
    }).catch(this.handleError);
  }

  register(model: any) {
    return this.http.post<any>(this.baseUrl + 'register', model, {
      headers: this.requestHeaders(),
      observe: 'response',
    }).catch(this.handleError);
  }

  private requestHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private handleError(error: HttpErrorResponse) {
    let modelStateErrors;

    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred: ' + error.error.message);
    } else if (typeof error.error === 'object') {
      modelStateErrors = '';
      for (const key in error.error) {
        if (error.error[key]) {
          modelStateErrors += error.error[key] + '\n';
        }
      }
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    return Observable.throw(modelStateErrors || 'something bad happend, please try again later.');
  }

}
