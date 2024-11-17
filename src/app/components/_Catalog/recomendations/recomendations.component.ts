import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Product } from '../../../interfaces/_General/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardRecomendationComponent } from '../../_General/product-card-recomendation/product-card-recomendation.component';

@Component({
  selector: 'app-recomendations',
  standalone: true,
  imports: [ProductCardRecomendationComponent, CommonModule],
  templateUrl: './recomendations.component.html',
  styleUrl: './recomendations.component.css'
})
export class RecomendationsComponent {
  @ViewChildren('productRow') productRows!: QueryList<ElementRef<HTMLElement>>;

  private allProducts: Product[] = [
    {
      id: 1,
      imageUrl: '../../../../assets/products/1.png',
      title: 'Серьги с малахитом и фианитом из желтого золотааааааааааааааааааааааааааааааааааааааааааааааа',
      price: 15040,
      currency: 'BYN'
    },
    {
      id: 2,
      imageUrl: '../../../../assets/products/2.png',
      title: 'Золотые серьги с бриллиантами',
      price: 18500,
      currency: 'BYN'
    },
    {
      id: 3,
      imageUrl: '../../../../assets/products/3.png',
      title: 'Кольцо из белого золота с сапфиром',
      price: 12300,
      currency: 'BYN'
    },
    {
      id: 4,
      imageUrl: '../../../../assets/products/4.png',
      title: 'Золотое колье с подвеской',
      price: 9800,
      currency: 'BYN'
    },
    {
      id: 5,
      imageUrl: '../../../../assets/products/5.png',
      title: 'Браслет из розового золота',
      price: 7600,
      currency: 'BYN'
    },
    {
      id: 6,
      imageUrl: '../../../../assets/products/1.png',
      title: 'Браслет из розового золота',
      price: 7600,
      currency: 'BYN'
    },
  ];

  items: any[] = [
    { name: 'Кольца' },
    { name: 'Серьги' },
    { name: 'Браслеты' },
    { name: 'Ожерелья' },
    { name: 'Подвески' }
  ];

  get firstRowProducts(): Product[] {
    return this.allProducts.slice();
  }
}
