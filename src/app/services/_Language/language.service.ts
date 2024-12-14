import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>('en'); // Текущий язык (по умолчанию "en")
  public languageChange$ = this.currentLanguage.asObservable(); // Observable для подписки на изменения

  constructor() {
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.currentLanguage.next(savedLanguage);
  }

  getLanguage(): string {
    return this.currentLanguage.getValue();
  }

  setLanguage(lang: string): void {
    if (lang !== this.getLanguage()) {
      localStorage.setItem('appLanguage', lang);
      this.currentLanguage.next(lang); // Уведомляем всех подписчиков
    }
  }
}
