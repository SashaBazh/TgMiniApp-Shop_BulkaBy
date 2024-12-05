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
  todayDate: string = new Date().toISOString().split('T')[0];

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
    // Обновление страницы
    setTimeout(() => {
      window.location.reload();
    }, 100); // Небольшая задержка для выполнения API-запроса
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
      // Обновляем дату рождения через сервис
      this.optionsService.updateBirthDate(this.selectedDate).subscribe({
        next: (response) => {
          console.log('Дата рождения обновлена успешно:', response);
          if (this.selectedDate !== null) {
            this.optionsService.setBirthDate(this.selectedDate); // Сохраняем локально
          } else {
            console.error('Дата не выбрана');
          }
          this.closeDatePicker();
        },
        error: (error) => {
          console.error('Ошибка при обновлении даты рождения:', error);
          alert('Не удалось обновить дату рождения.');
        },
      });
    }
  }
  

  contactManager(): void {
    this.optionsService.contactManager();
  }
}
