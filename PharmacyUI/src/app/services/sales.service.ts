import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SaleRecord } from '../models/sale-record';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  constructor(private readonly httpService: HttpService) {}

  getSales(): Observable<SaleRecord[]> {
    return this.httpService.get<SaleRecord[]>('Sales');
  }

  getSale(id: number): Observable<SaleRecord> {
    return this.httpService.get<SaleRecord>(`Sales/${id}`);
  }

  createSale(sale: SaleRecord): Observable<SaleRecord> {
    return this.httpService.post<SaleRecord>('Sales', sale);
  }
}
