import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { OptionsService } from '../../../services/_Options/option.service';
import { ProfileService } from '../../../services/_Profile/profile.service';

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

  // Список разрешённых username
  private allowedAdmins: string[] = ['admin_user1', 'superadmin', 'john_doe'];

  constructor(
    public optionsService: OptionsService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
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
          ? new Date(profile.birthday).toISOString().split('T')[0]
          : null;

        if (this.birthday) {
          this.optionsService.setBirthDate(this.birthday); // Сохраняем локально
        }
      },
      error: (error) => {
        console.error('Ошибка при загрузке даты рождения:', error);
      },
    });
  }

  checkAdminAccess(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        // Проверяем, есть ли username в списке разрешённых
        this.isAdmin = this.allowedAdmins.includes(profile.username);
      },
      error: (error) => {
        console.error('Ошибка проверки доступа к админке:', error);
      },
    });
  }

  toggleLanguage(): void {
    this.optionsService.toggleLanguage();
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
      // Преобразуем дату в формат `YYYY-MM-DD HH:MM:SS.ssssss`
      const formattedDate = this.formatDateForServer(this.selectedDate);
  
      this.optionsService.updateBirthDate(formattedDate).subscribe({
        next: (response) => {
          console.log('Дата рождения обновлена успешно:', response);
          this.optionsService.setBirthDate(formattedDate); // Сохраняем локально
          this.birthday = formattedDate; // Обновляем отображаемую дату
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
  
  private formatDateForServer(date: string): string {
    const now = new Date();
    const selectedDate = new Date(date);
    return `${selectedDate.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(6, '0')}`;
  }  
  

  contactManager(): void {
    this.optionsService.contactManager();
  }
}
