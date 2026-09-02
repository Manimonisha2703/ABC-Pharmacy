export interface SaleRecord {
  medicineId: number;
  quantity: number;
  customerName: string;
  saleDate?: Date | string;

}

export interface SaleFormValue {
  medicineId: number | string;
  quantity: number;
  customerName: string;
}
