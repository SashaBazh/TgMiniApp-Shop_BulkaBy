import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { AttributeResponse } from '../../interfaces/_Admin/attribute.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private getTelegramHeaders(contentType: string = 'application/json'): HttpHeaders {
    return new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': contentType,
    });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category`, { headers: this.getTelegramHeaders() });
  }

  getCategoryAttributes(categoryId: number): Observable<AttributeResponse[]> {
    const url = `${this.apiUrl}/category/${categoryId}/attributes`;
    return this.http.get<AttributeResponse[]>(url, { headers: this.getTelegramHeaders() });
  }

  getAllAttributes(): Observable<AttributeResponse[]> {
    const url = `${this.apiUrl}/attributes/all`;
    return this.http.get<AttributeResponse[]>(url, { headers: this.getTelegramHeaders() });
  }

  createCategory(categoryData: { name: string; description: string; translations: { ru: { name: string }; en: { name: string } }; image: File }): Observable<any> {
    const formData = new FormData();
    formData.append('category_data', JSON.stringify({
      name: categoryData.name,
      description: categoryData.description,
      translations: categoryData.translations,
    }));
    formData.append('image', categoryData.image, categoryData.image.name);

    return this.http.post(`${this.apiUrl}/categories`, formData, { headers: this.getTelegramHeaders('multipart/form-data') });
  }

  assignAttributesToCategory(categoryId: number, attributeIds: number[]): Observable<any[]> {
    const url = `${this.apiUrl}/categories/attributes`;

    const requests = attributeIds.map(attributeId => {
      const payload = { category_id: categoryId, attribute_id: attributeId };
      return this.http.post(url, payload, { headers: this.getTelegramHeaders() });
    });

    return forkJoin(requests);
  }

  updateCategory(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories`, formData, { headers: this.getTelegramHeaders('multipart/form-data') });
  }

  deleteCategory(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/categories/${categoryId}`;
    return this.http.delete(url, { headers: this.getTelegramHeaders() });
  }
}
