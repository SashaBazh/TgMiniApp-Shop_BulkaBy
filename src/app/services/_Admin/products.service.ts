import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

  private getTelegramHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  }

  getProducts(params: { category_id?: number; filters?: any; search?: string; limit?: number; offset?: number } = {}): Observable<Product[]> {
    const { category_id, filters = {}, search, limit = 50, offset = 0 } = params;

    let httpParams = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (search) {
      httpParams = httpParams.set('search', search);
    }

    // Добавляем фильтры
    for (const filterKey in filters) {
      const filterValues = filters[filterKey];
      if (Array.isArray(filterValues)) {
        filterValues.forEach((value: string) => {
          httpParams = httpParams.append(`filter_${filterKey}`, value);
        });
      } else {
        httpParams = httpParams.append(`filter_${filterKey}`, filterValues);
      }
    }

    const url = category_id ? `${this.apiUrl}/category/${category_id}` : this.apiUrl;

    return this.http.get<Product[]>(url, { headers: this.getTelegramHeaders(), params: httpParams });
  }

  getCategoryAttributes(categoryId: number): Observable<AttributeResponse[]> {
    const url = `${this.apiUrl}/category/${categoryId}/attributes`;
    return this.http.get<AttributeResponse[]>(url, { headers: this.getTelegramHeaders() });
  }

  getProductDetail(productId: number): Observable<ProductDetailResponse> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.get<ProductDetailResponse>(url, { headers: this.getTelegramHeaders() });
  }

  createProduct(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/`;
    return this.http.post(url, formData, { headers: this.getTelegramHeaders() });
  }

  updateProduct(productId: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.put(url, formData, { headers: this.getTelegramHeaders() });
  }

  deleteProduct(productId: number): Observable<any> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.delete(url, { headers: this.getTelegramHeaders() });
  }
}