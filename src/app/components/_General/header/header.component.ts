import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() pageTitle: string = 'Главная';

  isExpanded = false;
  menuItems = [
    { path: '/home', label: 'Главная' },
    { path: '/catalog', label: 'Меню' },
    { path: '/cart', label: 'Корзина' },
    { path: '/profile', label: 'Профиль' },
    { path: '/settings', label: 'Настройки' },
  ];

  private langChangeSubscription: Subscription | null = null;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Подписка на событие смены языка
    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.updatePageTitle();
      }
    );

    // Установка заголовка при инициализации
    this.updatePageTitle();
  }

  ngOnDestroy(): void {
    // Отписка от события
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private updatePageTitle(): void {
    this.pageTitle = this.translate.instant(this.pageTitle);
  }

  redirectToTelegram(): void {
    window.location.href = 'https://t.me/alenka15em';
  }
  
}
