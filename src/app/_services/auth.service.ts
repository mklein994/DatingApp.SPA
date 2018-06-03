import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject ,  Observable } from 'rxjs';




import { environment } from '../../environments/environment';
import { AuthUser } from '../_models/auth-user';
import { User } from '../_models/user';

@Injectable()
export class AuthService {

  baseUrl = environment.apiUrl;
  userToken: any;
  decodedToken: any;
  currentUser: User;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http
      .post<AuthUser>(this.baseUrl + 'auth/login', model, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json'),
      })
      .map(user => {
        if (user && user.tokenString) {
          localStorage.setItem('token', user.tokenString);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelperService.decodeToken(user.tokenString);
          this.currentUser = user.user;
          this.userToken = user.tokenString;
          if (this.currentUser.photoUrl !== null) {
            this.changeMemberPhoto(this.currentUser.photoUrl);
          } else {
            this.changeMemberPhoto('../../assets/user.png');
          }
        }
      });
  }

  register(user: User) {
    return this.http
      .post(this.baseUrl + 'auth/register', user, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json'),
      });
  }

  loggedIn() {
    const token = this.jwtHelperService.tokenGetter();

    if (!token) {
      return false;
    }

    return !this.jwtHelperService.isTokenExpired(token);
  }

}
