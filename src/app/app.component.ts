import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/_Telegram/telegram.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private telegramService: TelegramService) {}

  ngOnInit(): void {
    if (this.telegramService.isTelegramWebAppAvailable()) {
      const tgUser = this.telegramService.getUser();

      if (tgUser) {
        // Подготовим данные для регистрации
        const registerData = {
          telegram_id: tgUser.id,
          name:
            tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : ''),
          username: tgUser.username,
          lang: 'ru', // Язык по умолчанию
          points: 0, // Очки по умолчанию
        };

        this.telegramService.registerUser(registerData).subscribe({
          next: (res) => {
            // Пользователь успешно зарегистрирован
          },
          error: (err) => {
            if (
              err.status === 400 &&
              err.error?.detail ===
                'User with this telegram ID already exists'
            ) {
              // Пользователь уже зарегистрирован
            } else {
              // Ошибка при регистрации пользователя
            }
          },
        });
      } else {
        // Не удалось получить данные пользователя Telegram
      }
    } else {
      // Telegram WebApp недоступен
    }
  }
}
