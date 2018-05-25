import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment.prod';

@Injectable()
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  userToken: any;
  decodedToken: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  login(model: any) {
    return this.http.post<any>(this.baseUrl + 'login', model, {
      headers: this.requestHeaders(),
      observe: 'response',
    }).map((response: any) => {
      const user = response.body;
      if (user) {
        localStorage.setItem('token', user.tokenString);
        this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
        console.log(this.decodedToken);
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

  loggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  private requestHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private handleError(error: HttpErrorResponse) {
    let modelStateErrors;

    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred: ' + error.error.message);
    } else if (typeof error.error !== 'string') {
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
