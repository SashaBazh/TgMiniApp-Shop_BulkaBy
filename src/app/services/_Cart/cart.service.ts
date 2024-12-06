import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { AddProduct, CartResponse } from '../../interfaces/_Cart/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl);
  }

  addItemToCart(productId: number, quantity: number = 1): Observable<any> {
    const payload: AddProduct = { product_id: productId, quantity };
    return this.http.post(this.apiUrl, payload);
  }

  removeItemFromCart(productId: number): Observable<any> {
    const params = new HttpParams().set('product_id', productId.toString());
    return this.http.delete(this.apiUrl, { params });
  }

  updateItemQuantity(productId: number, quantity: number): Observable<any> {
    const payload: AddProduct = { product_id: productId, quantity };
    return this.http.put(this.apiUrl, payload);
  }
}