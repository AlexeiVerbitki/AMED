import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output()
  public skipEvent: EventEmitter<any> = new EventEmitter();

  skip = true;

  constructor() { }

  ngOnInit() {
  }

  skipMenu() {
    this.skip = !this.skip;
    this.skipEvent.emit(this.skip);
  }

}
