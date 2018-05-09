import { Component, OnInit } from '@angular/core';

import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService, private alerify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(
      data => this.alerify.success('logged in successfully'),
      error => this.alerify.error(error),
    );
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    this.alerify.message('logged out');
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

}
