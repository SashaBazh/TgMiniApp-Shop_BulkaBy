import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { AttributeResponse } from '../../interfaces/_Admin/attribute.interface';

// export interface ProductCategoryResponse {
//   id: number;
//   name: string;
//   description?: string;
//   image?: string;
// }

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  createCategory(categoryData: { name: string; description: string; translations: { ru: { name: string }; en: { name: string } }; image: File }): Observable<any> {
    const formData = new FormData();

    formData.append(
      'category_data',
      JSON.stringify({
        name: categoryData.name,
        description: categoryData.description,
        translations: categoryData.translations,
      })
    );

    formData.append('image', categoryData.image, categoryData.image.name);

    return this.http.post(`${this.apiUrl}/categories`, formData);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category`);
  }

  updateCategory(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories`, formData);
  }

  deleteCategory(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/categories/${categoryId}`;
    return this.http.delete(url);
  }
  

  getCategoryAttributes(categoryId: number): Observable<AttributeResponse[]> {
    const url = `${this.apiUrl}/category/${categoryId}/attributes`;
    return this.http.get<AttributeResponse[]>(url);
  }

  assignAttributesToCategory(categoryId: number, attributeIds: number[]): Observable<any[]> {
    const url = `${this.apiUrl}/categories/attributes`;

    const requests = attributeIds.map((attributeId) => {
      const payload = { category_id: categoryId, attribute_id: attributeId };
      return this.http.post(url, payload);
    });

    return forkJoin(requests);
  }

  getAllAttributes(): Observable<AttributeResponse[]> {
    const url = `${this.apiUrl}/attributes/all`;
    return this.http.get<AttributeResponse[]>(url);
  }
}
