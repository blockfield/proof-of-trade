import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChalkboardTeacher, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public faUser = faUser
  public faChalkboardTeacher = faChalkboardTeacher

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {}

  public goTo(state: string): void {
    this.router.navigate(['/', state])
  }

}
