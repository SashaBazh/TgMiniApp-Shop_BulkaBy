import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/_Telegram/telegram.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
