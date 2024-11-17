import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecomendationsComponent } from '../recomendations/recomendations.component';

@Component({
  selector: 'app-product-full-page',
  standalone: true,
  imports: [CommonModule, RecomendationsComponent],
  templateUrl: './product-full-page.component.html',
  styleUrl: './product-full-page.component.css'
})
export class ProductFullPageComponent {

  showDetails = false; // Управляет видимостью дополнительной информации

  toggleDetails() {
    this.showDetails = !this.showDetails; // Переключает состояние
  }


}
