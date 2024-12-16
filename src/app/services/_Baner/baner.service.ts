import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../../interfaces/_Admin/banner.interface';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class BanerService {

  private apiUrl = `${environment.apiUrl}/banner`;

  constructor(private http: HttpClient) {}
  private getTelegramHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
      'Content-Type': 'application/json',
    });
  }
 
  getBannerById(bannerId: number): Observable<Banner> {
    const headers = this.getTelegramHeaders();
    return this.http.get<Banner>(`${this.apiUrl}/${bannerId}`, { headers });
  }
}
