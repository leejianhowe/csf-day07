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
  constructor(private router: Router, private formDatabase: FormDataBase) {}
  ngOnInit(): void {}

  async saveForm() {
    let formData = new FormData()
    const imageData = this.formRef.image.nativeElement.files[0]
    console.log('image data',imageData)
    formData.append('image', imageData)
    formData.append('taskName', this.formRef.form.get('taskName').value)
    // console.log(typeof this.formRef.form.get('taskName').value)
    console.log('form data',formData)
    const object = await this.formDatabase.uploadImage(formData)
    const form = this.formRef.todo;
    // console.log(image)
    // set the form id as new uuid
    // form.titleId = id;
    // console.log('form saved', this.formRef.todo);
    // save to DB
    // await this.database.addForm(form);
    // route to main page
    // this.router.navigate(['/']);
  }
}
