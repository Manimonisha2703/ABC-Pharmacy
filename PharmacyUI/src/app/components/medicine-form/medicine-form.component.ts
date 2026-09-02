import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Medicine, MedicineFormValue } from '../../models/medicine';
import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-medicine-form',
  templateUrl: './medicine-form.component.html',
  styleUrls: ['./medicine-form.component.scss']
})
export class MedicineFormComponent implements OnInit {
  medicineForm: FormGroup;
  medicineId: number | null = null;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  showExitConfirmation = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly medicineService: MedicineService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.medicineForm = this.formBuilder.group({
      Name: ['', Validators.required],
      brand: ['', Validators.required],
      notes: [''],
      expiryDate: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const parsedId = routeId ? Number(routeId) : NaN;

    if (Number.isInteger(parsedId) && parsedId > 0) {
      this.medicineId = parsedId;
      this.isEditMode = true;
      this.loadMedicine(parsedId);
    }
  }

  onSubmit(): void {
    if (this.medicineForm.invalid || this.isSaving) {
      this.medicineForm.markAllAsTouched();
      return;
    }

    const formValue = this.medicineForm.getRawValue() as MedicineFormValue;
    const medicine: Medicine = {
      id: this.medicineId || 0,
      name: formValue.Name.trim(),
      brand: formValue.brand.trim(),
      notes: formValue.notes.trim(),
      expiryDate: formValue.expiryDate,
      quantity: Number(formValue.quantity),
      price: Number(formValue.price)
    };

    this.isSaving = true;
    this.errorMessage = '';

    const saveRequest: Observable<unknown> = this.isEditMode && this.medicineId !== null
      ? this.medicineService.updateMedicine(this.medicineId, medicine)
      : this.medicineService.addMedicine(medicine);

    saveRequest.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/medicines']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(error, 'Unable to save medicine.');
      }
    });
  }

  cancel(): void {
    if (this.medicineForm.dirty) {
      this.showExitConfirmation = true;
      return;
    }

    this.router.navigate(['/medicines']);
  }

  confirmExit(): void {
    this.router.navigate(['/medicines']);
  }

  cancelExit(): void {
    this.showExitConfirmation = false;
  }

  private loadMedicine(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.medicineService.getMedicine(id).subscribe({
      next: (medicine: Medicine) => {
        this.medicineForm.patchValue({
          Name: medicine.name,
          brand: medicine.brand,
          notes: medicine.notes,
          expiryDate: this.formatDateForInput(medicine.expiryDate),
          quantity: medicine.quantity,
          price: medicine.price
        });
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error, 'Unable to load medicine.');
      }
    });
  }

  private formatDateForInput(value: Date | string): string {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.substring(0, 10);
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return fallback;
  }

}
