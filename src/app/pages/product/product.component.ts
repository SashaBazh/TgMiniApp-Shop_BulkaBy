import { Component } from '@angular/core';
import { HeaderbackComponent } from '../../components/_General/headerback/headerback.component';
import { ProductFullPageComponent } from '../../components/_Catalog/product-full-page/product-full-page.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HeaderbackComponent, ProductFullPageComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

}
