import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { MainComponent } from './components/main/main.component';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';

// DB service
import { FormDataBase } from './components/form.database';

// Routing
const ROUTES = [
  { path: '', component: MainComponent },
  { path: 'create', component: CreateComponent },
  { path: 'task/:id', component: ListComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    MainComponent,
    CreateComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [FormDataBase],
  bootstrap: [AppComponent],
})
export class AppModule {}
