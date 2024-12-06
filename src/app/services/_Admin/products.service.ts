import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Product } from '../../interfaces/_General/product.interface';
import { AttributeResponse } from '../../interfaces/_Admin/attribute.interface';
import { ProductDetailResponse } from '../../interfaces/_General/product-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, formData);
  }

  getProducts(params: { category_id?: number; filters?: any; search?: string; limit?: number; offset?: number } = {}): Observable<Product[]> {
    const { category_id, filters = {}, search, limit = 50, offset = 0 } = params;

    let httpParams = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (search) {
      httpParams = httpParams.set('search', search);
    }

    const url = category_id ? `${this.apiUrl}/category/${category_id}` : this.apiUrl;

    return this.http.get<Product[]>(url, { params: httpParams });
  }

  getCategoryAttributes(categoryId: number): Observable<AttributeResponse[]> {
    const url = `${this.apiUrl}/category/${categoryId}/attributes`;
    return this.http.get<AttributeResponse[]>(url);
  }

  getProductDetail(productId: number): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${this.apiUrl}/${productId}`);
  }

  updateProduct(productId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/`, formData);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}