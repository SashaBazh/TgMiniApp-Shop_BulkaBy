import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { OrderCreateRequest, OrderResponse } from '../../interfaces/_Order/order.interface';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) { }

  createOrder(orderData: OrderCreateRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/order`, orderData);
  }
}
