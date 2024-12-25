import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecomendationsComponent } from '../recomendations/recomendations.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { ProductService } from '../../../services/_Product/product-service.service';
import { CartService } from '../../../services/_Cart/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-full-page',
  standalone: true,
  imports: [CommonModule, RecomendationsComponent, TranslateModule],
  templateUrl: './product-full-page.component.html',
  styleUrls: ['./product-full-page.component.css'],
})
export class ProductFullPageComponent {
  productId: number | null = null;
  product: any = null;
  mainAttributes: { name: string; value: any }[] = [];
  extraAttributes: { name: string; value: any }[] = [];
  showDetails = false;
  showMoreInfo: boolean = false;
  videoLoading: boolean = false;

  mediaItems: string[] = [];
  currentMediaIndex: number = 0;
  private languageSubscription!: Subscription;

  private touchStartX: number = 0; // Начальная позиция X
  private touchEndX: number = 0; // Конечная позиция X

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public imageService: ImageStreamService,
    private cartService: CartService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = +params.get('id')!;
      this.loadProduct(this.productId);
    });

    this.languageSubscription = this.translate.onLangChange.subscribe(() => {
      console.log('Язык изменен, обновляем продукт...');
      if (this.productId !== null) {
        this.loadProduct(this.productId);
      }
    });
  }

  ngOnDestroy() {
    // Отписываемся от событий при уничтожении компонента
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  loadProduct(productId: number) {
    this.product = null; // Сбрасываем продукт, чтобы показать прелоадер
    this.productService.getProductDetail(productId).subscribe({
      next: (data) => {
        this.product = data;
  
        if (this.product && Array.isArray(this.product.attribute_values)) {
          this.prepareAttributes();
        } else {
          console.warn('Атрибуты отсутствуют для продукта:', this.productId);
          this.mainAttributes = [];
          this.extraAttributes = [];
          this.isLoadingAttributes = false; // Завершаем состояние загрузки
        }
  
        this.prepareMedia();
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных о товаре:', err);
      },
    });
  }
  

  isLoadingAttributes: boolean = true;

  prepareAttributes() {
    if (!this.product || !this.product.attribute_values) return;

    this.isLoadingAttributes = true; // Начинаем подготовку

    const allAttributes = Array.isArray(this.product.attribute_values)
      ? this.product.attribute_values.map((attr: any) => ({
        name: attr.attribute?.name || 'Unknown Attribute',
        value: attr.value || 'N/A',
      }))
      : [];

    this.mainAttributes = allAttributes.slice(0, 3);
    this.extraAttributes = allAttributes.slice(3);

    if (this.product.description) {
      const descriptionLabel = this.translate.instant('DESCRIPTION');
      this.extraAttributes.unshift({ name: descriptionLabel, value: this.product.description });
    }

    this.isLoadingAttributes = false; // Завершаем подготовку
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

  onVideoLoadStart() {
    this.videoLoading = true;
  }

  onVideoCanPlay() {
    this.videoLoading = false;
  }


  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  addToCart() {
    if (this.productId !== null) {
      // alert(`Добавляем товар с ID ${this.productId} в корзину`);
      this.cartService.addItemToCart(this.productId, 1).subscribe({
        next: (data) => {
          // alert('Товар успешно добавлен в корзину');
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          // alert('Ошибка при добавлении товара в корзину');
        },
      });
    } else {
      // alert('ID товара отсутствует');
    }
  }

  addToCartFast() {
    if (this.productId !== null) {
      // alert(`Добавляем товар с ID ${this.productId} в корзину`);
      this.cartService.addItemToCart(this.productId, 1).subscribe({
        next: (data) => {
          // alert('Товар успешно добавлен в корзину');
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          // alert('Ошибка при добавлении товара в корзину');
        },
      });
    } else {
      // alert('ID товара отсутствует');
    }
  }




  currentIndex = 0;

  // Геттер для текущего элемента


  // Устанавливаем текущий индекс по клику на точку
  setIndex(index: number) {
    this.currentIndex = index;
  }

  toggleExpandableInfo() {
    this.showMoreInfo = !this.showMoreInfo;
  }

  // Обработка начала касания
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  // Обработка окончания касания
  onTouchEnd() {
    const threshold = 70; // Минимальное расстояние для распознавания свайпа
    const deltaX = this.touchEndX - this.touchStartX;

    if (deltaX > threshold) {
      // Свайп вправо
      this.prevMedia();
    } else if (deltaX < -threshold) {
      // Свайп влево
      this.nextMedia();
    }
  }

  // Обработка движения пальца
  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  contactManager(): void {
    window.location.href = 'https://t.me/alenka15em';
  }

  onUserClick(videoElement: HTMLVideoElement) {
    videoElement.play()
      .then(() => console.log('Видео играет'))
      .catch(err => console.error('Видео не запустилось', err));
  }
  
}
