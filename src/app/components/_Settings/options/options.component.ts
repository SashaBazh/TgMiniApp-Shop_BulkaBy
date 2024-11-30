import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { OptionsService } from '../../../services/_Options/option.service';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  selectedDate: string | null = null;
  isDatePickerOpen: boolean = false;

  // Свойства, отображаемые в шаблоне
  get language(): string {
    return this.optionsService.language;
  }

  get birthDate(): string | null {
    return this.optionsService.birthDate;
  }

  constructor(public optionsService: OptionsService) {}

  toggleLanguage(): void {
    this.optionsService.toggleLanguage();
  }

  toggleCurrency(): void {
    this.optionsService.toggleCurrency();
  }

  openDatePicker(): void {
    this.isDatePickerOpen = true;
  }

  closeDatePicker(): void {
    this.isDatePickerOpen = false;
  }

  saveDate(): void {
    if (this.selectedDate) {
      this.optionsService.setBirthDate(this.selectedDate);
      this.closeDatePicker();
    }
  }

  contactManager(): void {
    this.optionsService.contactManager();
  }
}
