import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Friend } from '../../../interfaces/_Profile/friend.interface';
import { TelegramService } from '../../../services/_Telegram/telegram.service';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent {
  @Input() avatarUrl!: string;
  @Input() username!: string;
  @Input() points!: number;
  @Input() referralLink!: string;

  friends: Friend[] = [
    { username: '@Username13', points: 14 },
    { username: '@Namuser1', points: 14 },
    { username: '@User31name1', points: 14 },
    { username: '@User124name1', points: 14 },
    { username: '@RQRfsername1', points: 14 },
    { username: '@41Username1', points: 14 },
    { username: '@Username13', points: 14 },
    { username: '@Namuser1', points: 14 },
    { username: '@User31name1', points: 14 },
    { username: '@User124name1', points: 14 },
    { username: '@RQRfsername1', points: 14 },
    { username: '@41Username1', points: 14 }
  ];

  constructor(private telegramService: TelegramService) {}

  ngOnInit() {
    const user = this.telegramService.getUser();
    if (user) {
      this.username = user.username || `${user.first_name} ${user.last_name}` || 'Unknown User';
      this.avatarUrl = user.photo_url || ''; // Используйте фото, если доступно
    }
  }

  get totalFriendPoints(): number {
    return this.friends.reduce((total, friend) => total + friend.points, 0);
  }

  copyReferralLink() {
    navigator.clipboard.writeText(this.referralLink).then(() => {
      alert('Ссылка скопирована в буфер обмена!');
    });
  }
}
