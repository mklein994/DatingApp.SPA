import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users', this.jwt())
      .catch(this.handleError);
  }

  private jwt() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
      headers.append('Content-Type', 'application/json');
      return { headers: headers };
    }
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
