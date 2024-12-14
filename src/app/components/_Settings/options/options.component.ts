import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { OptionsService } from '../../../services/_Options/option.service';
import { ProfileService } from '../../../services/_Profile/profile.service';
import { LanguageService } from '../../../services/_Language/language.service';

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
export class OptionsComponent implements OnInit {
  selectedDate: string | null = null;
  isDatePickerOpen: boolean = false;
  todayDate: string = new Date().toISOString().split('T')[0];
  isAdmin: boolean = false; // Отображать кнопку "Админка" или нет
  birthday: string | null = null; // Подгруженная дата рождения пользователя

  constructor(
    public optionsService: OptionsService,
    private profileService: ProfileService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit вызван');
    this.checkAdminAccess();
    this.loadBirthday(); // Подгружаем дату рождения
  }

  get language(): string {
    return this.optionsService.language;
  }

  loadBirthday(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        // Устанавливаем дату рождения, если она есть
        this.birthday = profile.birthday
          ? profile.birthday.substring(0, 10) // Оставляем первые 10 символов
          : null;

        console.log('Дата рождения из профиля:', this.birthday);

        // Сохраняем дату рождения в OptionsService
        if (this.birthday) {
          this.optionsService.setBirthDate(this.birthday);
        }

        console.log('Дата рождения установлена:', this.birthday);
      },
      error: (error) => {
        console.error('Ошибка при загрузке даты рождения:', error);
      },
    });
  }

  toggleLanguage(): void {
    this.optionsService.toggleLanguage();
    // setTimeout(() => {
    //   window.location.reload();
    // });

    const newLang = this.languageService.getLanguage() === 'ru' ? 'en' : 'ru';
    this.languageService.setLanguage(newLang);
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
      // Преобразуем дату в короткий формат `YYYY-MM-DD`
      const formattedDate = this.selectedDate.substring(0, 10); // Берём только первые 10 символов

      this.optionsService.updateBirthDate(formattedDate).subscribe({
        next: (response) => {
          console.log('Дата рождения обновлена успешно:', response);
          this.optionsService.setBirthDate(formattedDate); // Сохраняем локально
          this.birthday = formattedDate; // Обновляем отображаемую дату в формате `YYYY-MM-DD`
          this.closeDatePicker();
        },
        error: (error) => {
          console.error('Ошибка при обновлении даты рождения:', error);
          alert('Не удалось обновить дату рождения.');
        },
      });
    } else {
      console.error('Дата не выбрана');
    }
  }


  contactManager(): void {
    this.optionsService.contactManager();
  }

  checkAdminAccess(): void {
    this.profileService.checkIfAdmin().subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
      },
      error: (error) => {
        console.error('Ошибка проверки доступа к админке:', error);
      },
    });
  }



}
