import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { ProductCreateData, ProductResponse } from '../../interfaces/_Admin/product.interface';
import { Product } from '../../interfaces/_General/product.interface';
import { AttributeResponse } from '../../interfaces/_Admin/attribute.interface';
import { ProductDetailResponse } from '../../interfaces/_General/product-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  createProduct(productData: ProductCreateData): Observable<any> {
    const formData = new FormData();

    // Prepare product data
    const productDataJson = JSON.stringify({
      category_id: productData.category_id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      attributes: productData.attributes,
    });
    formData.append('product_data', productDataJson);

    console.log('Product Data JSON:', productDataJson);

    // Add images if provided
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((file) => {
        formData.append('files', file, file.name); // Обновлено: используем 'files' как ключ
      });
    }

    // Add Telegram initialization data
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });

    return this.http.post(`${this.apiUrl}/`, formData, { headers });
  }

  getProducts(params: { category_id?: number, filters?: any, search?: string, limit?: number, offset?: number } = {}): Observable<Product[]> {
    const { category_id, filters = {}, search, limit = 50, offset = 0 } = params;

    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    let httpParams = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (search) {
      httpParams = httpParams.set('search', search);
    }

    // Добавляем фильтры в параметры запроса, если необходимо

    const url = category_id
      ? `${this.apiUrl}/category/${category_id}`
      : this.apiUrl;

    return this.http.get<Product[]>(url, { headers, params: httpParams });
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

  getProductDetail(productId: number): Observable<ProductDetailResponse> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data':
        (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });

    return this.http.get<ProductDetailResponse>(
      `${this.apiUrl}/${productId}`,
      { headers }
    );
  }

  updateProduct(productId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/`, formData, {
      headers: {
        'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      },
    });
  }  
  
  

  deleteProduct(productId: number): Observable<any> {
    const headers = {
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    };
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers });
  }
  
  




}