import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDataBase } from '../form.database';
import { FormModel } from '../form.model';
import { FormComponent } from '../form/form.component';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @ViewChild('form') formRef: FormComponent;
  titleId: string;
  form: FormModel;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formDataBase: FormDataBase
  ) {}

  async ngOnInit(): Promise<void> {
    this.titleId = this.route.snapshot.paramMap.get('id');
    this.form = await this.formDataBase.getTask(this.titleId);
    console.log('retrieved task', this.form);
    // set the values from form
    this.formRef.todo = this.form;
    console.log('form saved', this.formRef.todo);
  }

  async save() {
    const formData: FormModel = this.formRef.todo as FormModel
    formData.titleId = this.titleId
    console.log(formData)
    await this.formDataBase.saveTask(formData);
    this.router.navigate(['/']);
  }
  async delete() {
    await this.formDataBase.deleteTask(this.titleId);
    this.router.navigate(['/']);
  }
}
