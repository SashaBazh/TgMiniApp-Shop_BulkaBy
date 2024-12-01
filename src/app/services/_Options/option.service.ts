import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  private _language: string = 'RU';
  private _currency: string = 'BYN';
  private _birthDate: string | null = null;

  constructor(private translate: TranslateService, private http: HttpClient) {
    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang('ru');

    const savedLang = localStorage.getItem('appLanguage');
    this._language = savedLang
      ? savedLang.toUpperCase()
      : this.translate.getBrowserLang()?.toUpperCase() || 'RU';

    this.setLanguage(this._language);
  }

  private apiUrl = `${environment.apiUrl}/user`;

  // Getters
  get language(): string {
    return this._language;
  }

  get currency(): string {
    return this._currency;
  }

  get birthDate(): string | null {
    return this._birthDate;
  }

  // Language methods
  toggleLanguage(): void {
    this._language = this._language === 'RU' ? 'EN' : 'RU';
    this.setLanguage(this._language);
  }

  setLanguage(lang: string): void {
    if (this.translate.currentLang !== lang.toLowerCase()) {
      this.translate.use(lang.toLowerCase());
    }
    this._language = lang.toUpperCase();
    localStorage.setItem('appLanguage', lang.toLowerCase());
  }

  // Currency methods
  toggleCurrency(): void {
    this._currency =
      this._currency === 'BYN'
        ? 'USD'
        : this._currency === 'USD'
        ? 'RUB'
        : 'BYN';
  }

  // Date methods
  setBirthDate(date: string): void {
    this._birthDate = date;
  }

  clearBirthDate(): void {
    this._birthDate = null;
  }

  updateBirthDate(date: string): Observable<any> {
    const telegramId = (window as any).Telegram.WebApp.initDataUnsafe?.user?.id; // Получение ID пользователя
    return this.http.put(`${this.apiUrl}/birthday`, { telegram_id: telegramId, birthday: date });
  }

  // Manager contact
  contactManager(): void {
    alert(this.translate.instant('CONTACT_MANAGER'));
  }
}
