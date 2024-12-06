import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Импортируем HttpClient и HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { ProductDetailResponse } from '../../interfaces/_General/product-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProductDetail(productId: number): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${this.apiUrl}/${productId}`);
  }
}
