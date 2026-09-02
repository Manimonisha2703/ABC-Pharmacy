import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Medicine } from '../models/medicine';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  constructor(private readonly httpService: HttpService) {}

  getMedicines(): Observable<Medicine[]> {
    return this.httpService.get<Medicine[]>(environment.apiUrl, '/Medicines');
  }

  getMedicine(id: number): Observable<Medicine> {
    return this.httpService.get<Medicine>(environment.apiUrl, `/Medicines/${id}`);
  }

  addMedicine(medicine: Medicine): Observable<Medicine> {
    return this.httpService.post<Medicine>(environment.apiUrl, '/Medicines', medicine);
  }

  updateMedicine(id: number, medicine: Medicine): Observable<void> {
    return this.httpService.put<void>(environment.apiUrl, `/Medicines/${id}`, medicine);
  }

  deleteMedicine(id: number): Observable<void> {
    return this.httpService.delete<void>(environment.apiUrl, `/Medicines/${id}`);
  }

}
