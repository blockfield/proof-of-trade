import { Component, OnInit } from '@angular/core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.less']
})
export class ConnectionComponent implements OnInit {

  public faArrowUp = faArrowUp

  constructor() { }

  ngOnInit(): void {
  }

  public goToProviderSite(): void {
    window.open("https://phantom.app/", "_blank")
  }

}
