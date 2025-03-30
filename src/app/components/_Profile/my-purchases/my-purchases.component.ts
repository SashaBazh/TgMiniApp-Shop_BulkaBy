import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/_Cart/cart.service';
import { CommonModule } from '@angular/common';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-purchases',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css'],
})
export class MyPurchasesComponent implements OnInit {
  products: any[] = []; // Уникальные продукты с их количеством
  isLoading: boolean = false;

  constructor(private orderService: CartService, private imageService: ImageStreamService) {}

  ngOnInit(): void {
    this.fetchOrderProducts();
  }

  /**
   * Получение продуктов из всех заказов с подсчетом количества
   */
  fetchOrderProducts(): void {
    this.isLoading = true;
    this.orderService.getOrderHistory(10, 0).subscribe({
      next: (data) => {
        const productMap = new Map<number, any>();

        data.forEach((order) => {
          order.items.forEach((item: { product: any; quantity: number; price: number }) => {
            const productId = item.product.id;
            if (productMap.has(productId)) {
              const existingProduct = productMap.get(productId);
              existingProduct.quantity += item.quantity;
              // Optionally update the status if needed
              existingProduct.status = order.status; 
            } else {
              productMap.set(productId, {
                ...item.product,
                quantity: item.quantity,
                price: item.price,
                status: order.status, // Include status
                image:
                  item.product.media && item.product.media.length > 0
                    ? this.imageService.getImageUrl(item.product.media[0])
                    : 'assets/default-image.png',
              });
            }            
          });
        });

        this.products = Array.from(productMap.values());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке продуктов из заказов:', err);
        this.isLoading = false;
      },
    });
  }
}
