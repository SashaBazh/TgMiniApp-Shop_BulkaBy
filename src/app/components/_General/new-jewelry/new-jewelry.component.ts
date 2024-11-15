import { Component, ElementRef, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Product } from '../../../interfaces/_General/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'app-new-jewelry',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FiltersComponent],
  templateUrl: './new-jewelry.component.html',
  styleUrl: './new-jewelry.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NewJewelryComponent {
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
    return this.allProducts.slice(0, Math.ceil(this.allProducts.length / 2));
  }

  get secondRowProducts(): Product[] {
    return this.allProducts.slice(Math.ceil(this.allProducts.length / 2));
  }
}