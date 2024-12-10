import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private tg: any;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {
    // Проверяем, выполняется ли код в браузере
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) {
      console.warn('Код выполняется не в браузере');
      return;
    }

    console.log('Код выполняется в браузере');

    const windowObj = this._document.defaultView;
    if (!windowObj) {
      console.warn('windowObj отсутствует');
      return;
    }

    console.log('windowObj существует');

    if (!windowObj.Telegram) {
      console.warn('windowObj.Telegram отсутствует');
      return;
    }

    console.log('windowObj.Telegram существует');

    if (!windowObj.Telegram.WebApp) {
      console.warn('windowObj.Telegram.WebApp отсутствует');
      return;
    }

    console.log('windowObj.Telegram.WebApp существует, инициализируем this.tg');
    this.tg = windowObj.Telegram.WebApp;
    console.log('this.tg успешно инициализирован');
  }

  isTelegramWebAppAvailable(): boolean {
    return !!this.tg;
  }

  initializeApp(): void {
    console.log('Инициализация приложения начата');

    if (!this.tg) {
      console.warn('Ошибка: this.tg равен undefined');
      return;
    }

    try {
      console.log('Telegram WebApp объект доступен, начинаем настройку');
      
      console.log('Вызов tg.expand()');
      this.tg.expand();
      console.log('tg.expand() выполнен успешно');
      
      console.log('Вызов tg.enableClosingConfirmation()');
      this.tg.enableClosingConfirmation();
      console.log('tg.enableClosingConfirmation() выполнен успешно');
      
      console.log('Вызов tg.setViewportSettings({ rotate: false })');
      this.tg.setViewportSettings({ rotate: false });
      console.log('tg.setViewportSettings выполнен успешно');
      
      console.log('Вызов tg.ready()');
      this.tg.ready();
      console.log('tg.ready() выполнен успешно');
    } catch (error) {
      console.error('Ошибка при настройке Telegram WebApp: ' + JSON.stringify(error));
    }

    console.log('Инициализация приложения завершена');
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

  // registerUser(data: {
  //   telegram_id: number;
  //   name: string;
  //   username?: string;
  //   lang?: string;
  //   points?: number;
  //   image?: string;
  //   birthday?: string;
  //   referrer_id?: number;
  // }): Observable<any> {
  //   const url = `${environment.apiUrl}/auth/register`;
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'api-key': '2750562d-a939-4eff-8b3a-d214d1afb794',
  //   };
  
  //   return this.http.post(url, data, { headers });
  // }

  showTelegramAlert(message: string): void {
    if (this.tg?.showAlert) {
      this.tg.showAlert(message);
    } else {
      console.warn('Telegram WebApp alert недоступен, используйте fallback');
    }
  }
  
  
}
