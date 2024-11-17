import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-full-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-full-page.component.html',
  styleUrl: './product-full-page.component.css'
})
export class ProductFullPageComponent {
  
  showDetails = false; // Управляет видимостью дополнительной информации

  recommendations = [
    {
      image: '../../../../assets/catalog/1.png',
      title: 'Серьги с бриллиантами',
      price: '1540',
    },
    {
      image: '../../../../assets/catalog/2.png',
      title: 'Кольцо с бриллиантами',
      price: '1345',
    },
    {
      image: '../../../../assets/catalog/1.png',
      title: 'Серьги из золота',
      price: '980',
    },
    {
      image: '../../../../assets/catalog/2.png',
      title: 'Браслет с бриллиантами',
      price: '2450',
    },
  ];

  toggleDetails() {
    this.showDetails = !this.showDetails; // Переключает состояние
  }


}
