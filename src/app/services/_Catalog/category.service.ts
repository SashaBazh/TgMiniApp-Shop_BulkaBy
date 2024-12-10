import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Product } from '../../interfaces/_General/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/products`;

  private headers = new HttpHeaders({
    'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
  });

  constructor(private http: HttpClient) { }

  getCategoryAttributes(categoryId: number, filterable: boolean = true): Observable<any[]> {
    const params = { filterable: filterable.toString() };
    console.log('Отправляем запрос с параметрами:', {
      url: `${this.apiUrl}/category/${categoryId}/attributes`,
      params,
    });

    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}/attributes`, {
      params,
      headers: this.headers,
    });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category`, { headers: this.headers });
  }

  getProductsByCategory(
    categoryId: number,
    filters: any = {},
    search?: string,
    limit: number = 50,
    offset: number = 0
  ): Observable<Product[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (search) {
      params = params.set('search', search);
    }

    for (const attributeId in filters) {
      const values = filters[attributeId];
      const filterKey = `filter_${attributeId}`;
      if (Array.isArray(values)) {
        values.forEach((value: string) => {
          params = params.append(filterKey, value);
        });
      } else {
        params = params.append(filterKey, values);
      }
    }

    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`, {
      params,
      headers: this.headers,
    });
  }

  getPersonalOffers(limit: number = 10): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Product[]>(`${this.apiUrl}/personal-offers`, {
      params,
      headers: this.headers,
    });
  }

  getNewProducts(limit: number = 10, offset: number = 0): Observable<Product[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    return this.http.get<Product[]>(`${this.apiUrl}/new`, {
      params,
      headers: this.headers,
    });
  }
}
