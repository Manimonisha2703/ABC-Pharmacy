import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Medicine } from '../../models/medicine';
import { SaleRecord } from '../../models/sale-record';
import { MedicineService } from '../../services/medicine.service';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  medicines: Medicine[] = [];
  sales: SaleRecord[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly medicineService: MedicineService,
    private readonly salesService: SalesService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.medicineService.getMedicines().subscribe({
      next: (medicines: Medicine[]) => {
        this.medicines = medicines;
        this.loadSales();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error, 'Unable to load medicines.');
      }
    });
  }

  loadSales(): void {
    this.salesService.getSales().subscribe({
      next: (sales: SaleRecord[]) => {
        this.sales = sales;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error, 'Unable to load sales history.');
      }
    });
  }

  onSaleRecorded(): void {
    this.loadData();
  }

  getMedicineName(medicineId: number): string {
    const medicine = this.medicines.find((item: Medicine) => item.id === medicineId);
    return medicine ? medicine.name : `Medicine #${medicineId}`;
  }

  getSaleTotal(sale: SaleRecord): number {
    const medicine = this.medicines.find((item: Medicine) => item.id === sale.medicineId);
    return medicine ? medicine.price * sale.quantity : 0;
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return fallback;
  }

}
