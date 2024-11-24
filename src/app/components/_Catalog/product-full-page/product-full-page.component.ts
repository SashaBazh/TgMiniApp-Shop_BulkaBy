import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecomendationsComponent } from '../recomendations/recomendations.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { ProductService } from '../../../services/_Product/product-service.service';
import { CartService } from '../../../services/_Cart/cart.service';

@Component({
  selector: 'app-product-full-page',
  standalone: true,
  imports: [CommonModule, RecomendationsComponent],
  templateUrl: './product-full-page.component.html',
  styleUrls: ['./product-full-page.component.css'],
})
export class ProductFullPageComponent {
  productId: number | null = null;
  product: any = null;
  mainAttributes: { name: string; value: any }[] = [];
  extraAttributes: { name: string; value: any }[] = [];
  showDetails = false;

  // Media variables
  mediaItems: string[] = [];
  currentMediaIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public imageService: ImageStreamService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = +params.get('id')!;
      this.loadProduct(this.productId);
    });
  }

  loadProduct(productId: number) {
    this.productService.getProductDetail(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.prepareAttributes();
        this.prepareMedia();
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных о товаре:', err);
      }
    });
  }

  prepareAttributes() {
    if (!this.product) return;

    // Transform attributes from attribute_values
    const allAttributes = this.product.attribute_values.map((attr: any) => ({
      name: attr.attribute.name,
      value: attr.value
    }));

    // Add price at the beginning
    allAttributes.unshift({ name: 'Цена', value: `${this.product.price} BYN` });

    // Split into main and extra attributes
    this.mainAttributes = allAttributes.slice(0, 3);
    this.extraAttributes = allAttributes.slice(3);

    // Add description to extra attributes
    if (this.product.description) {
      this.extraAttributes.unshift({ name: 'Описание', value: this.product.description });
    }
  }

  // Prepare media items
  prepareMedia() {
    if (!this.product) return;

    // Assuming media URLs are stored in product.media
    this.mediaItems = this.product.media.map((mediaUrl: string) =>
      this.imageService.getImageUrl(mediaUrl)
    );

    // Set initial media index
    this.currentMediaIndex = 0;
  }

  // Navigation methods
  prevMedia() {
    this.currentMediaIndex = (this.currentMediaIndex - 1 + this.mediaItems.length) % this.mediaItems.length;
  }
  

  nextMedia() {
    this.currentMediaIndex = (this.currentMediaIndex + 1) % this.mediaItems.length;
  }
  

  selectMedia(index: number) {
    this.currentMediaIndex = index;
  }
  

  get currentMedia(): string | null {
    return this.mediaItems.length > 0 ? this.mediaItems[this.currentMediaIndex] : null;
  }

  isImage(mediaUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
  }

  isVideo(mediaUrl: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(mediaUrl);
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  addToCart() {
    if (this.productId !== null) {
      console.log(`Добавляем товар с ID ${this.productId} в корзину`);
      this.cartService.addItemToCart(this.productId, 1).subscribe({
        next: (data) => {
          console.log('Товар успешно добавлен в корзину', data);
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          console.error('Ошибка при добавлении товара в корзину:', err);
        },
      });
    } else {
      console.error('ID товара отсутствует');
    }
  }

  addToCartFast() {
    if (this.productId !== null) {
      console.log(`Добавляем товар с ID ${this.productId} в корзину`);
      this.cartService.addItemToCart(this.productId, 1).subscribe({
        next: (data) => {
          console.log('Товар успешно добавлен в корзину', data);
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('Ошибка при добавлении товара в корзину:', err);
        },
      });
    } else {
      console.error('ID товара отсутствует');
    }
  }



  currentIndex = 0;

  // Геттер для текущего элемента
  
  
  // Устанавливаем текущий индекс по клику на точку
  setIndex(index: number) {
    this.currentIndex = index;
  }
}
