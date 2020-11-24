import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormComponent } from '../form/form.component';
import { FormDataBase } from '../form.database';
import { v4 as uuid } from 'uuid';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  // this formRef gets the entire FormComponent
  // above to access the methods/attributes
  @ViewChild('form') formRef: FormComponent;
  constructor(private router: Router, private database: FormDataBase) {}

  ngOnInit(): void {}

  async saveForm() {
    // generate new id for form
    const id = uuid().toString().substring(0, 8);
    console.log(id);
    // get the values from form
    const form = this.formRef.todo;
    // set the form id as new uuid
    form.titleId = id;
    console.log('form saved', this.formRef.todo);
    // save to DB
    await this.database.addForm(form);
    // route to main page
    this.router.navigate(['/']);
  }
}
