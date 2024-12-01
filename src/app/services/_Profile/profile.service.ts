import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { UserProfileResponse } from '../../interfaces/_Profile/friend.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/user/profile`;

  constructor(private http: HttpClient) {}
  
  getUserProfile(): Observable<UserProfileResponse> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    return this.http.get<UserProfileResponse>(this.apiUrl, { headers }).pipe(
      tap((response) => {
        console.log('Полученные данные профиля:', response);
      }),
      tap({
        error: (error) => {
          console.error('Ошибка при получении профиля:', error);
        },
      })
    );
  }
}
