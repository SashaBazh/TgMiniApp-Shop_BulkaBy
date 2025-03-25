import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TelegramService } from '../../../services/_Telegram/telegram.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../services/_Profile/profile.service';
import { UserProfileResponse } from '../../../interfaces/_Profile/friend.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent implements OnInit {
  @Input() avatarUrl!: string;
  @Input() username!: string;
  @Input() points!: number;
  @Input() referralLink!: string;
  @Input() status!: string;

  friends: { username: string; points: number }[] = [];
  totalFriendPoints: number = 0;

  constructor(
    private profileService: ProfileService,
    private telegramService: TelegramService,
    private router: Router
  ) { }

  ngOnInit() {
    // Загружаем данные из Telegram API
    const user = this.telegramService.getUser();
    if (user) {
      this.username = user.username || `${user.first_name} ${user.last_name}` || 'Unknown User';
      this.avatarUrl = user.photo_url || ''; // Фото из Telegram
    }
    else{
      this.username = 'Sasha';
    }

    // Загружаем данные профиля с сервера
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.profileService.getUserProfile().subscribe({
      next: (profile: UserProfileResponse) => {
        this.points = profile.points;
        this.referralLink = profile.referral_link;
        this.status = profile.status;
        this.friends = profile.referrals.map((ref) => ({
          username: ref.username,
          points: ref.earnings,
        }));
        this.totalFriendPoints = this.friends.reduce(
          (total, friend) => total + friend.points,
          0
        );
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных профиля:', err);
      },
    });
  }

  copyReferralLink(event: Event): void {
    event.preventDefault(); // Предотвращает открытие ссылки
  
    if (!this.referralLink) {
      console.error('Реферальная ссылка отсутствует');
      return;
    }
  
    navigator.clipboard.writeText(this.referralLink).then(() => {
      if (this.telegramService?.isTelegramWebAppAvailable?.()) {
        this.telegramService.showTelegramAlert('Ссылка скопирована в буфер обмена!');
      } else {
        alert('Ссылка скопирована в буфер обмена!');
      }
    }).catch((error) => {
      console.error('Ошибка при копировании ссылки:', error);
    });
  }
  
  

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'gold':
        return 'status-gold';
      case 'black':
        return 'status-black';
      case 'diamond':
        return 'status-diamond';
      case 'silver':
        return 'status-silver';
      default:
        return '';
    }
  }

  getDiscount(status: string): number {
    switch (status) {
        case 'Дегустатор 🍩': return 5;
        case 'Сладкоежка 🍪': return 10;
        case 'Гурман выпечки 🍰': return 15;
        case 'Пекарный король 👑': return 20;
        default: return 0;
    }
}


  navigateToPurchases(): void {
    this.router.navigate(['profile/my-purchases']);
  }


}