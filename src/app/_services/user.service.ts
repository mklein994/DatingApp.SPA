import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) { }

  getUsers(page?: number, itemsPerPage?: number): Observable<User[]> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let queryString = '?';

    if (page !== null && itemsPerPage !== null) {
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage;
    }

    return this.authHttp.get(this.baseUrl + 'users' + queryString)
      .map((response: Response) => {
        paginatedResult.result = response.json();

        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
      .catch(this.handleError);
  }

  getUser(id: number): Observable<User> {
    return this.authHttp.get(this.baseUrl + 'users/' + id)
      .map(response => <User>response.json())
      .catch(this.handleError);
  }

  updateUser(id: number, user: User) {
    return this.authHttp.put(this.baseUrl + 'users/' + id, user)
      .catch(this.handleError);
  }

  setMainPhoto(userId: number, id: number) {
    return this.authHttp
      .post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setmain', {})
      .catch(this.handleError);
  }

  deletePhoto(userId: number, id: number) {
    return this.authHttp.delete(this.baseUrl + 'users/' + userId + '/photos/' + id)
      .catch(this.handleError);
  }

  private handleError(error: any) {
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

    console.error(error);
    return Observable.throw(modelStateErrors || 'something bad happend, please try again later.');
  }
}
