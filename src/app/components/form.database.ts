import { Injectable } from '@angular/core';
// Dexie is a Document Based DB
import { Dexie } from 'dexie';
//import FormModel
import { FormModel, Summary } from './form.model';

@Injectable()
export class FormDataBase extends Dexie {
  private form: Dexie.Table<FormModel, string>;

  constructor() {
    // database name: formDB
    super('formDB');
    // setup schema for v1
    this.version(1).stores({
      // name of table is form, primary key is "id"
      form: 'titleId',
    });
    // get a reference to the form collection
    this.form = this.table('form');
  }

  async addForm(formData: FormModel): Promise<any> {
    return await this.form.put(formData);
  }

  async getSummary(): Promise<Summary[]> {
    //.toArray returns array
    return (await this.form.toArray()).map((ele) => {
      return { titleId: ele.titleId, title: ele.title } as Summary;
    });
  }
  async getTask(titleId: string): Promise<FormModel> {
    return await this.form.get(titleId);
  }

  async deleteTask(titleId: string): Promise<any> {
    return await this.form.delete(titleId);
  }

  // async saveTask(formData: FormModel): Promise<any> {
  //   return await this.form.put(formData);
  // }
}
