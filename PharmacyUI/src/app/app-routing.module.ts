import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MedicineFormComponent } from './components/medicine-form/medicine-form.component';
import { MedicineListComponent } from './components/medicine-list/medicine-list.component';
import { SalesComponent } from './components/sales/sales.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/medicines', pathMatch: 'full' },
  { path: 'medicines', component: MedicineListComponent },
  { path: 'medicines/add', component: MedicineFormComponent },
  { path: 'medicines/edit/:id', component: MedicineFormComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'sales/add', component: SaleFormComponent },
  { path: '**', redirectTo: '/medicines' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
