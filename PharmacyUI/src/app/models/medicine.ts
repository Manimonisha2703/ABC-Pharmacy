export interface Medicine {
  id: number;
  name: string;
  notes: string;
  expiryDate: Date | string;
  quantity: number;
  price: number;
  brand: string;
}

export interface MedicineFormValue {
  Name: string;
  brand: string;
  notes: string;
  expiryDate: string;
  quantity: number;
  price: number;
}
