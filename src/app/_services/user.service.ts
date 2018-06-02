import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: HttpClient) { }

  getUsers(page?: any, itemsPerPage?: any, userParams?: any, likesParam?: string) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (likesParam === 'Likers') {
      params = params.append('Likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('Likees', 'true');
    }

    if (userParams != null) {
      params = params
        .append('minAge', userParams.minAge)
        .append('maxAge', userParams.maxAge)
        .append('gender', userParams.gender)
        .append('orderBy', userParams.orderBy);
    }

    return this.authHttp.get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
      .map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
      .catch(this.handleError);
  }

  getUser(id: number): Observable<User> {
    return this.authHttp
      .get(this.baseUrl + 'users/' + id)
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

  sendLike(id: number, recipientId: number) {
    return this.authHttp.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {})
      .catch(this.handleError);
  }

  getMessages(id: number, page?: any, itemsPerPage?: any, messageContainer?: any) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.authHttp.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', { observe: 'response', params })
      .map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      }).catch(this.handleError);
  }

  getMessageThread(id: number, recipientId: number) {
    return this.authHttp
      .get(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId)
      .catch(this.handleError);
  }

  sendMessage(id: number, message: string) {
    return this.authHttp
      .post(this.baseUrl + 'users/' + id + '/messages', message)
      .catch(this.handleError);
  }

  deleteMessage(id: number, userId: number) {
    return this.authHttp
      .post(this.baseUrl + 'users/' + userId + '/messages/' + id, {})
      .catch(this.handleError);
  }

  markAsRead(userId: number, messageId: number) {
    return this.authHttp
      .post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
      .subscribe();
  }

  private handleError(error: any) {
    if (error.status === 400) {
      return Observable.throw(error._body);
    }

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
