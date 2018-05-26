import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { BsDropdownModule } from 'ngx-bootstrap';

import { environment } from '../environments/environment';

import { AuthGuard } from './_guards/auth.guard';
import { AlertifyService } from './_services/alertify.service';
import { AuthService } from './_services/auth.service';
import { UserService } from './_services/user.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export function jwtOptionsFactory(authService: AuthService) {
  return {
    tokenGetter: () => {
      return authService.userToken;
    },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService],
      },
      /*
      config: {
        tokenGetter: () => tokenGetter(),
        whitelistedDomains: [environment.apiDomain],
        blacklistedRoutes: [environment.apiUrl + 'auth/'],
      },
      */
    }),
    AppRoutingModule,
    FormsModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [
    AuthService,
    AlertifyService,
    AuthGuard,
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
