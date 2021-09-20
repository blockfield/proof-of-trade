import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {
  public states = ["user", "trader"]
  public current: string

  constructor(
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initCurrent(this.location.path())
  }

  public initCurrent(path: string): void {
    let state = this.states[0]
    if (path) {
      state = path.match(/\/(.*)/)[1]

      if (!this.states.includes(state)) {
        state = this.states[0]
      }
    }

    this.current = state
  }

  public goTo(stateToGo: string): void {
    if (stateToGo === this.current) {
      return
    }

    this.current = stateToGo
    this.router.navigateByUrl('/'+stateToGo)
  }

}
