import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private apiUrl = `${environment.apiUrl}/products/discount`;

  constructor(private http: HttpClient) {}

  getDiscounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  createDiscount(discountData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, discountData);
  }

  updateDiscount(discountId: number, discountData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${discountId}`, discountData);
  }

  deleteDiscount(discountId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${discountId}`);
  }
}
