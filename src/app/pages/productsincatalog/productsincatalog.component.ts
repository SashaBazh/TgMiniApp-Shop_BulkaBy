import { Component } from '@angular/core';
import { ProductsComponent } from '../../components/_Catalog/products/products.component';

@Component({
  selector: 'app-productsincatalog',
  standalone: true,
  imports: [ProductsComponent],
  templateUrl: './productsincatalog.component.html',
  styleUrl: './productsincatalog.component.css'
})
export class ProductsincatalogComponent {

}
