import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MedicineListComponent } from './components/medicine-list/medicine-list.component';
import { MedicineFormComponent } from './components/medicine-form/medicine-form.component';
import { SalesComponent } from './components/sales/sales.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MedicineListComponent,
    MedicineFormComponent,
    SalesComponent,
    SaleFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
