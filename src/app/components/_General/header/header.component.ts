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
  @Input() pageTitle: string = 'HOME';

  isExpanded = false;
  menuItems = [
    { path: '/home', label: 'HOME' },
    { path: '/catalog', label: 'MENU' },
    { path: '/cart', label: 'CART' },
    { path: '/profile', label: 'PROFILE' },
    { path: '/settings', label: 'SETTINGS' },
  ];

  translatedMenuItems = this.menuItems.map(item => ({
    path: item.path,
    label: this.translate.instant(item.label),
  }));

  private langChangeSubscription: Subscription | null = null;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translateMenu();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.translateMenu();
    });

    this.updatePageTitle();
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private updatePageTitle(): void {
    this.pageTitle = this.translate.instant(this.pageTitle);
  }

  private translateMenu(): void {
    this.translatedMenuItems = this.menuItems.map(item => ({
      path: item.path,
      label: this.translate.instant(item.label),
    }));
  }

  redirectToTelegram(): void {
    window.location.href = 'https://t.me/alenka15em';
  }
}
