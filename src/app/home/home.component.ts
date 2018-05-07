import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  registerMode = false;
  values: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }

  registerToggle() {
    this.registerMode = true;
  }

  getValues() {
    this.http.get<any>('http://localhost:5000/api/values')
      .subscribe(values => {
        console.log(values);
        this.values = values;
      });
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
}
