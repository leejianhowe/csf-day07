import { Injectable } from '@angular/core';
// Dexie is a Document Based DB
import { Dexie } from 'dexie';
//import FormModel
import { FormModel, Summary } from './form.model';

import { HttpClient} from '@angular/common/http'
@Injectable()
export class FormDataBase extends Dexie {
  private form: Dexie.Table<FormModel, string>;
  URL:string = 'http://localhost:3000'
  constructor(private http: HttpClient) {

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
    console.log(formData)
    // return this.http.post('http://localhost:3000/',formData)
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

  async uploadImage(formData){
    const result = await this.http.post(`${this.URL}/upload`,formData).toPromise()
    console.log(result)
    return result
  }

  // async saveTask(formData: FormModel): Promise<any> {
  //   return await this.form.put(formData);
  // }
}
