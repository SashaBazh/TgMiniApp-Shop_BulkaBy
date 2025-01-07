import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TelegramService } from './services/_Telegram/telegram.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from './services/_User/user.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor( private router: Router, private telegramService: TelegramService, private authServise: UserService) {}

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0); // Устанавливаем прокрутку в начало
      });

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
