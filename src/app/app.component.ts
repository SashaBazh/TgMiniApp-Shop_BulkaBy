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
    }
  }
}
