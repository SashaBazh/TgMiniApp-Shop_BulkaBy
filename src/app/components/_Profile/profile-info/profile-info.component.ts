import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Friend } from '../../../interfaces/_Profile/friend.interface';

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
    { username: '@41Username1', points: 14 }
  ];

  get totalFriendPoints(): number {
    return this.friends.reduce((total, friend) => total + friend.points, 0);
  }

  copyReferralLink() {
    navigator.clipboard.writeText(this.referralLink).then(() => {
      alert('Ссылка скопирована в буфер обмена!');
    });
  }
}
