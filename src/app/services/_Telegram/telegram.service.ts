import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private tg: any;
  private apiUrl = `${environment.apiUrl}/auth/auth`;

  constructor(@Inject(DOCUMENT) private _document: Document, private http: HttpClient) {
    // Проверяем, доступен ли объект window
    const windowObj = this._document.defaultView;
    if (typeof window !== 'undefined' && windowObj && windowObj.Telegram && windowObj.Telegram.WebApp) {
      this.tg = windowObj.Telegram.WebApp;
      console.log('Telegram WebApp SDK is initialized.');
    } //else {
     // console.warn('Telegram WebApp SDK is not loaded or not available.');
    //}
  }

  showAlert(message: string, callback?: () => void): void {
    if (this.tg && typeof this.tg.showAlert === 'function') {
      this.tg.showAlert(message, callback);
    } else {
      console.warn('Telegram showAlert is not available. Message:', message);
      if (callback) callback();
    }
  }

  isTelegramWebAppAvailable(): boolean {
    return !!this.tg;
  }

  initializeApp(): void {
    if (this.tg) {
      this.tg.expand();
      this.tg.enableClosingConfirmation();
      this.tg.setViewportSettings({ rotate: false });
      this.tg.ready();
      console.log('Telegram WebApp is initialized and expanded.');
    } else {
      console.warn('Telegram WebApp is not available for initialization.');
    }
  }

  expandApp() {
    if (this.tg && typeof this.tg.expand === 'function') {
      this.tg.expand();
     } //else {
    //   console.error('Telegram WebApp API is not available');
    // }
  }

  getUser(): any {
    if (this.tg && this.tg.initDataUnsafe && this.tg.initDataUnsafe.user) {
      return this.tg.initDataUnsafe.user; // Возвращает объект пользователя
    } else {
      console.warn('Telegram user data is not available.');
      return null;
    }
  }

  getTelegramInitData(): string | null {
    return this.tg?.initData || null;
  }

  authenticateUser(telegramInitData: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Telegram-Init-Data': telegramInitData,
    });

    return this.http.post(`${this.apiUrl}`, {}, { headers });
  }
  
}
