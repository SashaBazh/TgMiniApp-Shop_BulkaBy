import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

export interface RegisterUser {
  telegram_id: number;
  name: string;
  username?: string;
  lang?: string;
  points?: number;
  image?: string;
  birthday?: string; // либо Date, если вы будете конвертировать
  referrer_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/auth/register`;

  constructor(private http: HttpClient) {}

  registerUser(data: RegisterUser): Observable<any> {
    const initData = (window as any).Telegram?.WebApp?.initData;
  
    alert('initData: ' + initData);
    alert('initDataUnsafe: ' + JSON.stringify((window as any).Telegram?.WebApp?.initDataUnsafe));
  
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': initData || '123',
      'api-key': 'eee3f863-ce17-42e2-a9ae-15d3ee832705'
    });
  
    return this.http.post(this.apiUrl, data, { headers });
  }
  
}
