// categories.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Attribute, AttributeResponse } from '../../interfaces/_Admin/attribute.interface';

export interface ProductCategoryResponse {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  createCategory(categoryData: { name: string; description: string; image: File }): Observable<any> {
    const formData = new FormData();

    // Правильно формируем данные
    formData.append('category_data', JSON.stringify({
      name: categoryData.name,
      description: categoryData.description,
    }));
    formData.append('image', categoryData.image, categoryData.image.name); // Добавляем имя файла

    // Добавляем заголовки, если необходимо
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      // Не указываем Content-Type, браузер сам его установит для FormData
    });

    return this.http.post(`${this.apiUrl}/categories`, formData, { headers });
  }

  getCategories(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiUrl}/category`, { headers });
  }

  // Обновление категории
  updateCategory(
    categoryId: number,
    categoryData: { name: string; description: string; image?: File | null }
  ): Observable<any> {
    const formData = new FormData();

    formData.append(
      'category_data',
      JSON.stringify({
        name: categoryData.name,
        description: categoryData.description,
      })
    );
    if (categoryData.image) {
      formData.append('image', categoryData.image, categoryData.image.name);
    }

    return this.http.put(`${this.apiUrl}/${categoryId}`, formData);
  }

  // Удаление категории
  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${categoryId}`);
  }

  getCategoryAttributes(categoryId: number): Observable<AttributeResponse[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });

    const url = `${this.apiUrl}/category/${categoryId}/attributes`;
    console.log('Making GET request to:', url, 'with headers:', headers); // Логирование запроса

    return this.http.get<AttributeResponse[]>(url, { headers })
      .pipe(
        tap((attributes: any) => console.log('Attributes received from API in service:', attributes)) // Логирование ответа
      );
  }

  assignAttributesToCategory(categoryId: number, attributeIds: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });
  
    const url = `${this.apiUrl}/categories/${categoryId}/attributes`;
  
    return this.http.put(url, { attribute_ids: attributeIds }, { headers });
  }
  

  // categories.service.ts

  getAllAttributes(): Observable<AttributeResponse[]> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });

    const url = `${this.apiUrl}/attributes/all`; // Предполагаем, что этот эндпоинт возвращает все атрибуты
    return this.http.get<AttributeResponse[]>(url, { headers });
  }


}
