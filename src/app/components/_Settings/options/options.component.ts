import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  language: string = 'RU';
  currency: string = 'BYN';
  birthDate: string | null = null;
  selectedDate: string | null = null;
  isDatePickerOpen: boolean = false;

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang('ru');

    const savedLang = localStorage.getItem('appLanguage');
    this.language = savedLang
      ? savedLang.toUpperCase()
      : this.translate.getBrowserLang()?.toUpperCase() || 'RU';

    this.setLanguage(this.language);
  }

  toggleLanguage() {
    this.language = this.language === 'RU' ? 'EN' : 'RU';
    this.setLanguage(this.language);
  }

  setLanguage(lang: string) {
    if (this.translate.currentLang !== lang.toLowerCase()) {
      this.translate.use(lang.toLowerCase());
    }
    this.language = lang.toUpperCase();
    localStorage.setItem('appLanguage', lang.toLowerCase());
  }

  toggleCurrency() {
    this.currency =
      this.currency === 'BYN'
        ? 'USD'
        : this.currency === 'USD'
        ? 'RUB'
        : 'BYN';
  }

  openDatePicker() {
    this.isDatePickerOpen = true;
  }

  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  saveDate() {
    if (this.selectedDate) {
      this.birthDate = this.selectedDate;
      this.closeDatePicker();
    }
  }

  contactManager() {
    alert(this.translate.instant('CONTACT_MANAGER'));
  }
}
