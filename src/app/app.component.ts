import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Demo';
  check = true;
  myList = ['prasanjit', 'adi', 'ramesh'];
  myObjectList = [{name: 'tata', value: 2000000},{ name: 'maruti', value: 350000}];
  test() {
    this.check = !this.check;
    console.log('hello');
  }
}
