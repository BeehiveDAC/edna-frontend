import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  myList = [];
  constructor(private http: Http) { }

  ngOnInit(): void {
    this.http.get('http://jsonplaceholder.typicode.com/users').pipe(map(data => data.json())).subscribe(result => {
      console.log(result);
      this.myList = result;
    }, (err) => {
      console.log(err);
    });
  }

}
