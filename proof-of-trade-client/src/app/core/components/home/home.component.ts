import { Component, OnInit } from '@angular/core';
import { faChalkboardTeacher, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public faUser = faUser
  public faChalkboardTeacher = faChalkboardTeacher

  constructor() { }

  ngOnInit(): void {}

}
