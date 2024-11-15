import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-headerback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './headerback.component.html',
  styleUrl: './headerback.component.css'
})
export class HeaderbackComponent {
  @Input() pageTitle: string = 'Главная';
}
