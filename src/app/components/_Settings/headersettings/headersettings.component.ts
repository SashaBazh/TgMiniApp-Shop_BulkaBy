import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-headersettings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './headersettings.component.html',
  styleUrls: ['./headersettings.component.css']
})
export class HeadersettingsComponent {
  @Input() pageTitle: string = 'Главная';
  isTooltipVisible: boolean = false;

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }

  toggleInfoTooltip() {
    this.isTooltipVisible = !this.isTooltipVisible;
    if (this.isTooltipVisible) {
      setTimeout(() => {
        this.isTooltipVisible = false; // Автоматическое скрытие через 3 секунды
      }, 5000);
    }
  }
}
