import { Component, OnInit } from '@angular/core';
import { FormDataBase } from '../form.database';
import { Summary } from '../form.model';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private database: FormDataBase) {}
  list: Summary[];
  ngOnInit(): void {
    this.database.getSummary().then((ele) => {
      this.list = ele;
      console.log(ele);
    });
  }
}
