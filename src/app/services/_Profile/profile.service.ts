import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { UserProfileResponse } from '../../interfaces/_Profile/friend.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}
  
  getUserProfile(): Observable<UserProfileResponse> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/profile`, { headers })
  }

  checkIfAdmin(): Observable<{ is_admin: boolean }> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
    });
  
    return this.http.get<{ is_admin: boolean }>(`${this.apiUrl}/is-admin`, { headers });
  }
  
}
