import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/_Telegram/telegram.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from './services/_User/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private telegramService: TelegramService, private authServise: UserService) {}

  ngOnInit(): void {
    if (this.telegramService.isTelegramWebAppAvailable()) {
      this.telegramService.expandApp();
      this.telegramService.initializeApp();
      const tgUser = this.telegramService.getUser();

      if (tgUser) {
        // Подготовим данные для регистрации
        const registerData = {
          telegram_id: tgUser.id,
          name:
            tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : ''),
          username: tgUser.username,
          lang: 'en', // Язык по умолчанию
          points: 0, // Очки по умолчанию
        };

        this.authServise.registerUser(registerData).subscribe({
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
