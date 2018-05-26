import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http) { }

  login(model: any) {
    return this.http
      .post(this.baseUrl + 'login', model, this.requestOptions())
      .map((response: Response) => {
        const user = response.json();
        if (user && user.tokenString) {
          localStorage.setItem('token', user.tokenString);
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
          console.log(this.decodedToken);
          this.userToken = user.tokenString;
        }
      }).catch(this.handleError);
  }

  register(model: any) {
    return this.http
      .post(this.baseUrl + 'register', model, this.requestOptions())
      .catch(this.handleError);
  }

  loggedIn() {
    return tokenNotExpired('token');
  }

  private requestOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return new RequestOptions({ headers: headers });
  }

  private handleError(error: any) {
    let modelStateErrors;
    console.warn(error);

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
