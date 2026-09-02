import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Medicine } from '../../models/medicine';
import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss']
})
export class MedicineListComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly medicineService: MedicineService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.medicineService.getMedicines().subscribe(
      (medicines: Medicine[]) => {
        this.medicines = medicines;
        this.filteredMedicines = medicines;
        this.isLoading = false;
        this.onSearch();
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.medicines = [];
        this.filteredMedicines = [];
        this.errorMessage = this.getErrorMessage(error, 'Unable to load medicines.');
      }
    );
  }

  onSearch(): void {
    const searchText = this.searchTerm.trim().toLowerCase();

    if (!searchText) {
      this.filteredMedicines = this.medicines;
      return;
    }

    this.filteredMedicines = this.medicines.filter((medicine: Medicine) =>
      medicine.name.toLowerCase().includes(searchText)
    );
  }

  addMedicine(): void {
    this.router.navigate(['/medicines/add']);
  }

  editMedicine(id: number): void {
    this.router.navigate(['/medicines/edit', id]);
  }

  deleteMedicine(id: number): void {
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    this.medicineService.deleteMedicine(id).subscribe({
      next: () => this.loadMedicines(),
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Unable to delete medicine.');
      }
    });
  }

  isExpiringSoon(medicine: Medicine): boolean {
    const expiryDate = this.toDate(medicine.expiryDate);
    if (!expiryDate) {
      return false;
    }

    const today = this.startOfDay(new Date());
    const thirtyDaysFromToday = new Date(today);
    thirtyDaysFromToday.setDate(thirtyDaysFromToday.getDate() + 30);

    return expiryDate < thirtyDaysFromToday;
  }

  isLowStock(medicine: Medicine): boolean {
    return medicine.quantity < 10;
  }

  getRowClass(medicine: Medicine): string {
    if (this.isExpiringSoon(medicine)) {
      return 'expiry-warning';
    }

    if (this.isLowStock(medicine)) {
      return 'low-stock-warning';
    }

    return '';
  }

  private toDate(value: string | Date): Date | null {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : this.startOfDay(value);
    }

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnlyMatch) {
      const year = Number(dateOnlyMatch[1]);
      const month = Number(dateOnlyMatch[2]) - 1;
      const day = Number(dateOnlyMatch[3]);
      return new Date(year, month, day);
    }

    const parsedDate = new Date(value);
    return isNaN(parsedDate.getTime()) ? null : this.startOfDay(parsedDate);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return fallback;
  }

}
