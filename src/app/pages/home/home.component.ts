import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../../components/_General/navigation/navigation.component';
import { HeaderComponent } from '../../components/_General/header/header.component';
import { ImageSliderComponent } from '../../components/_Home/image-slider/image-slider.component';
import { ImagesSlidersComponent } from '../../components/_Home/images-sliders/images-sliders.component';
import { NewJewelryComponent } from '../../components/_General/new-jewelry/new-jewelry.component';
import { CatalogButtonComponent } from '../../components/_Home/catalog-button/catalog-button.component';
import { CataloggeneralComponent } from '../../components/_General/cataloggeneral/cataloggeneral.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TelegramService } from '../../services/_Telegram/telegram.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavigationComponent,
    HeaderComponent,
    ImageSliderComponent,
    ImagesSlidersComponent,
    NewJewelryComponent,
    CatalogButtonComponent,
    CataloggeneralComponent,
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  items: any[] = [
    { name: 'Кольца' },
    { name: 'Серьги' },
    { name: 'Браслеты' },
    { name: 'Ожерелья' },
    { name: 'Подвески' },
  ];

  constructor(
    private translate: TranslateService,
    private telegramService: TelegramService
  ) {
    this.translate.setDefaultLang('ru');
  }

  ngOnInit(): void {
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
