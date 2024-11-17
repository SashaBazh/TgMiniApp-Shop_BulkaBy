import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-headersettings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './headersettings.component.html',
  styleUrl: './headersettings.component.css'
})
export class HeadersettingsComponent {
  @Input() pageTitle: string = 'Главная';

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }
}
