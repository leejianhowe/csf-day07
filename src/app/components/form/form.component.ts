import { Component, Input, OnInit } from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormModel } from '../form.model';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  form: FormGroup;
  formTaskArray: FormArray;
  formTaskGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
    // form.get('task) returns an AbstractControl need to
    // cast the AC as an FormArray again
    this.formTaskArray = this.form.get('task') as FormArray;
  }

  private createForm(title?: string): FormGroup {
    return this.fb.group({
      title: this.fb.control(title, [Validators.required]),
      task: this.fb.array([]),
    });
  }

  private createTask(
    description?: string,
    priority: number = 1,
    due?: string
  ): FormGroup {
    return this.fb.group({
      description: this.fb.control(description),
      priority: this.fb.control(priority),
      due: this.fb.control(due),
    });
  }

  get task(): FormArray {
    return this.form.get('task') as FormArray;
  }

  get todo(): FormModel {
    const formData: FormModel = this.form.value as FormModel;
    formData.task = formData.task.map((ele) => {
      // @ts-ignore
      ele.priority = parseInt(ele.priority);
      return ele;
    });
    return this.form.value as FormModel;
  }

  set todo(task: FormModel) {
    this.form.get('title').patchValue(task.title);
    task.task.map((ele) => {
      this.formTaskArray.push(
        this.createTask(ele.description, ele.priority, ele.due)
      );
    });
  }

  addTask() {
    const newTask = this.createTask();
    this.formTaskArray.push(newTask);
  }
  show() {
    console.log('form value includes array', this.form.value);
    //this.task refers to the formarray
    console.log('array value', this.task.value);
  }

  removeTask(index) {
    this.formTaskArray.removeAt(index);
  }

  // alternative create the arrays in the createForm and assign them OnInit
  // example
  /**
   * ngOnInit():void{
   *  this.form= this.createForm()
   * }
   */

  /**   createForm(): FormGroup{
      this.formArray = this.fb.array([])
      return this.fb.group({
        title: this.fb.control('', [Validators.required]),
        task: this.formArray,
      });
    }
    */
}
