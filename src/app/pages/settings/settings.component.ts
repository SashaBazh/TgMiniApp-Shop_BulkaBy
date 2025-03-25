import { Component } from '@angular/core';
import { OptionsComponent } from '../../components/_Settings/options/options.component';
import { HeadersettingsComponent } from '../../components/_Settings/headersettings/headersettings.component';
import { OptionsService } from '../../services/_Options/option.service';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeadersettingsComponent, OptionsComponent, HeaderComponent, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  selectedDate: string | null = null;

  constructor(public optionsService: OptionsService) {}

  saveDate(): void {
    if (this.selectedDate) {
      this.optionsService.updateBirthDate(this.selectedDate).subscribe({
        next: (response) => {
          console.log('Дата сохранена успешно:', response);
          if (this.selectedDate) { // Убедимся, что selectedDate не null
            this.optionsService.setBirthDate(this.selectedDate); // Локальное обновление даты
          }
          this.closeDatePicker(); // Закрытие пикера
        },
        error: (err) => {
          console.error('Ошибка при сохранении даты рождения:', err);
        },
      });
    }
  }
  
  

  closeDatePicker(): void {
    console.log('Закрытие пикера даты');
  }

}
