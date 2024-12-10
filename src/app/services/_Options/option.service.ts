import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  private _language: string = 'RU';
  private _currency: string = 'BYN';
  private _birthDate: string | null = null;

  private apiUrl = `${environment.apiUrl}/user`;

  // Заголовок Telegram Init Data
  private headers = new HttpHeaders({
    'X-Telegram-Init-Data': (window as any).Telegram?.WebApp?.initData || '',
  });

  constructor(private translate: TranslateService, private http: HttpClient) {
    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang('ru');

    const savedLang = localStorage.getItem('appLanguage');
    this._language = savedLang
      ? savedLang.toUpperCase()
      : this.translate.getBrowserLang()?.toUpperCase() || 'RU';

    this.setLanguage(this._language);
  }

  get language(): string {
    return this._language;
  }

  get currency(): string {
    return this._currency;
  }

  get birthDate(): string | null {
    return this._birthDate;
  }

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
    this.updateLanguage(lang.toLowerCase()).subscribe(
      (response: any) => console.log(response),
      (error: any) => console.error('Error updating language:', error)
    );
  }

  private updateLanguage(lang: string): Observable<any> {
    const payload = { telegram_id: 123456789, lang }; // Replace 123456789 with actual Telegram ID
    return this.http.post(`${this.apiUrl}/lang`, payload, { headers: this.headers });
  }

  private getTelegramId(): number | undefined {
    return (window as any).Telegram.WebApp.initDataUnsafe?.user?.id;
  }

  toggleCurrency(): void {
    this._currency =
      this._currency === 'BYN'
        ? 'USD'
        : this._currency === 'USD'
        ? 'RUB'
        : 'BYN';
  }

  setBirthDate(date: string): void {
    this._birthDate = date;
  }

  clearBirthDate(): void {
    this._birthDate = null;
  }

  updateBirthDate(date: string): Observable<any> {
    const telegramId = this.getTelegramId();
    const formattedDate = new Date(date).toISOString().replace('T', ' ').replace('Z', '');

    return this.http.put(
      `${this.apiUrl}/birthday`,
      {
        telegram_id: telegramId,
        birthday: formattedDate,
      },
      { headers: this.headers }
    );
  }

  contactManager(): void {
    alert(this.translate.instant('CONTACT_MANAGER'));
  }
}
