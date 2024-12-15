import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private tg: any;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
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
  
      // Настройка WebApp
      this.tg.expand();
      this.tg.enableClosingConfirmation(); // Включаем подтверждение закрытия
      this.tg.setViewportSettings({ rotate: false }); // Блокировка ориентации
      this.tg.disableSwipeBack(); // Отключаем вертикальные свайпы
      this.tg.ready(); // Уведомляем Telegram, что WebApp готов
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

  showTelegramAlert(message: string): void {
    if (this.tg?.showAlert) {
      this.tg.showAlert(message);
    } else {
      console.warn('Telegram WebApp alert недоступен, используйте fallback');
    }
  }

  requestFullscreen() {
    if (this.tg?.requestFullscreen) {
      this.tg.requestFullscreen().catch((err: any) => {
        console.error('Ошибка при попытке перейти в полноэкранный режим:', err);
      });
    } else {
      console.warn('requestFullscreen недоступен');
    }
  }
  
}
