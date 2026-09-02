import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Medicine } from '../../models/medicine';
import { SaleFormValue, SaleRecord } from '../../models/sale-record';
import { MedicineService } from '../../services/medicine.service';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent implements OnInit, OnChanges {
  @Input() medicines: Medicine[] = [];
  @Output() saleRecorded = new EventEmitter<void>();

  saleForm: FormGroup;
  selectedMedicine: Medicine | null = null;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  showExitConfirmation = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly medicineService: MedicineService,
    private readonly salesService: SalesService,
    private readonly router: Router
  ) {
    this.saleForm = this.formBuilder.group({
      medicineId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      customerName: ['', [Validators.required, Validators.pattern(/^[\p{L}][\p{L}.'-]*(?:\s+[\p{L}][\p{L}.'-]*)*$/u)]]
    });
  }

  ngOnInit(): void {
    if (this.medicines.length === 0) {
      this.medicineService.getMedicines().subscribe({
        next: (medicines: Medicine[]) => {
          this.medicines = medicines;
          this.updateSelectedMedicine();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.getErrorMessage(error, 'Unable to load medicines.');
        }
      });
    } else {
      this.updateSelectedMedicine();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medicines']) {
      this.updateSelectedMedicine();
    }
  }

  onMedicineChange(): void {
    this.updateSelectedMedicine();
  }

  get totalAmount(): number {
    const quantity = Number(this.saleForm.get('quantity')?.value) || 0;
    return this.selectedMedicine ? this.selectedMedicine.price * quantity : 0;
  }

  isQuantityOverStock(): boolean {
    const quantity = Number(this.saleForm.get('quantity')?.value) || 0;
    return !!this.selectedMedicine && quantity > this.selectedMedicine.quantity;
  }

  closeForm(): void {
    if (this.saleForm.dirty) {
      this.showExitConfirmation = true;
      return;
    }

    this.router.navigate(['/sales']);
  }

  confirmExit(): void {
    this.router.navigate(['/sales']);
  }

  cancelExit(): void {
    this.showExitConfirmation = false;
  }

  onSubmit(): void {
    if (this.saleForm.invalid || this.isQuantityOverStock() || this.isSaving) {
      this.saleForm.markAllAsTouched();
      return;
    }

    const formValue = this.saleForm.getRawValue() as SaleFormValue;
    const sale: SaleRecord = {
      medicineId: Number(formValue.medicineId),
      quantity: Number(formValue.quantity),
      customerName: formValue.customerName.trim(),
    };

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.salesService.createSale(sale).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Sale recorded successfully.';
        this.saleForm.reset({ medicineId: '', quantity: 1, customerName: '' });
        this.selectedMedicine = null;
        this.saleRecorded.emit();
        this.router.navigate(['/sales']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(error, 'Unable to record sale.');
      }
    });
  }

  private updateSelectedMedicine(): void {
    const medicineId = Number(this.saleForm.get('medicineId')?.value);
    this.selectedMedicine = this.medicines.find((medicine: Medicine) => medicine.id === medicineId) || null;
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return fallback;
  }
}
