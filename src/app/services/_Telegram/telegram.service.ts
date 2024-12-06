import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private tg: any;
  private apiUrl = `${environment.apiUrl}/auth/auth`;

  constructor(@Inject(DOCUMENT) private _document: Document, private http: HttpClient) {
    const windowObj = this._document.defaultView;
    if (typeof window !== 'undefined' && windowObj && windowObj.Telegram && windowObj.Telegram.WebApp) {
      this.tg = windowObj.Telegram.WebApp;
    }
  }

  showAlert(message: string, callback?: () => void): void {
    if (this.tg?.showAlert) {
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
    } else {
      console.warn('Telegram WebApp is not available for initialization.');
    }
  }

  expandApp() {
    if (this.tg?.expand) {
      this.tg.expand();
    }
  }

  getUser(): any {
    return this.tg?.initDataUnsafe?.user || null;
  }

  getTelegramInitData(): string | null {
    return this.tg?.initData || null;
  }

  authenticateUser(telegramInitData: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {});
  }
}
