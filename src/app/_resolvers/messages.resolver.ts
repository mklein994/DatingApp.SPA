import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';



import { Message } from '../_models/message';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageSize = 5;
  pageNumber = 1;
  messageContainer = 'Unread';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userService.getMessages(
      this.authService.decodedToken.nameid,
      this.pageNumber,
      this.pageSize,
      this.messageContainer,
    ).catch(error => {
      this.alertify.error('Problem retrieving data');
      this.router.navigate(['/home']);
      return Observable.of(null);
    });
  }

}
