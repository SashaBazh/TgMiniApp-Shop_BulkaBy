import { Component, Input } from '@angular/core';
import { Product } from '../../../interfaces/_General/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card-recomendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card-recomendation.component.html',
  styleUrl: './product-card-recomendation.component.css'
})
export class ProductCardRecomendationComponent {
  @Input() product!: Product;
}
