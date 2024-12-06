import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/_Telegram/telegram.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private telegramService: TelegramService) {}

  ngOnInit(): void {
    // Инициализируем приложение
    if (this.telegramService.isTelegramWebAppAvailable()) {
      this.telegramService.initializeApp();
      alert('Telegram WebApp доступен. Приложение инициализировано.');
    } else {
      alert('Telegram WebApp недоступен.');
    }

    const telegramInitData = (window as any).Telegram?.WebApp?.initData || '';
    alert(`Telegram Init Data: ${telegramInitData}`);

    if (telegramInitData) {
      this.telegramService.authenticateUser(telegramInitData).subscribe({
        next: (response) => {
          alert('Пользователь успешно авторизован. Ответ сервера: ' + JSON.stringify(response));
          console.log('Пользователь успешно авторизован:', response);
        },
        error: (error) => {
          alert('Ошибка авторизации: ' + JSON.stringify(error));
          console.error('Ошибка авторизации:', error);
        },
      });
    } else {
      alert('Отсутствуют данные Telegram WebApp для авторизации.');
      console.error('Отсутствуют данные Telegram WebApp для авторизации.');
    }
  }
}
