import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private tg: any;

  constructor(@Inject(DOCUMENT) private _document: Document) {
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
  
}
