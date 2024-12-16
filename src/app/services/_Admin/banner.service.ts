import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../../interfaces/_Admin/banner.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private apiUrl = `${environment.apiUrl}/banner`;

  constructor(private http: HttpClient) {}

  private getTelegramHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '1',
      'Content-Type': 'application/json',
    });
  }

  /**
   * Получить все баннеры (с поддержкой фильтрации по категории)
   * @param category - категория баннеров (необязательно)
   */
  getBanners(category?: string): Observable<Banner[]> {
    const headers = this.getTelegramHeaders();
    const params = category ? { category } : undefined;
    return this.http.get<Banner[]>(`${this.apiUrl}/`, { headers, params });
  }
  

  /**
   * Обновить баннеры для определенного типа
   * @param bannerData - данные баннера (включая id и категорию)
   * @param images - массив новых изображений (необязательно)
   */
  updateBanner(bannerData: { id: number; category: string }, images?: File[]): Observable<any> {
    const headers = this.getTelegramHeaders();
    const formData = new FormData();

    formData.append('banner_data', JSON.stringify(bannerData));
    if (images) {
      images.forEach((image, index) => {
        formData.append(`files`, image, image.name);
      });
    }

    return this.http.put(`${this.apiUrl}/`, formData, { headers: headers.delete('Content-Type') });
  }
}
