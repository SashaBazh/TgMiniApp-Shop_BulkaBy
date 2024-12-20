import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SlideImage } from '../../../interfaces/_Home/image-slider.interface';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';
import { BanerService } from '../../../services/_Baner/baner.service';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css'
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  @Input() bannerId: number = 1; // ID баннера по умолчанию (для home)

  images: SlideImage[] = [];
  currentIndex = 0;
  private intervalId: number | undefined;
  public imagesLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private bannerService: BanerService,
    private imageService: ImageStreamService
  ) {}

  get currentImage(): SlideImage {
    return this.images[this.currentIndex];
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadImagesFromService();
    }
  }

  ngOnDestroy() {
    this.stopSlideshow();
  }

  private loadImagesFromService() {
    this.bannerService.getBannerById(this.bannerId).subscribe({
      next: (banner) => {
        this.images = banner.media.map((mediaUrl) => ({
          url: this.imageService.getImageUrl(mediaUrl),
          alt: banner.category || 'Banner Image'
        }));
        this.preloadImages();
      },
      error: (err) => {
        console.error('Failed to load banner', err);
      }
    });
  }

  private preloadImages() {
    const imagePromises = this.images.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });
    });
  
    Promise.all(imagePromises).then(() => {
      this.imagesLoaded = true; // Устанавливаем флаг загрузки
      this.startSlideshow();
      this.cdr.detectChanges();
    });
  }
  

  private startSlideshow() {
    if (!this.imagesLoaded) return;

    this.intervalId = window.setInterval(() => {
      this.next();
      this.cdr.detectChanges();
    }, 5000);
  }

  private stopSlideshow() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  setIndex(index: number) {
    this.currentIndex = index;
    this.stopSlideshow();
    this.startSlideshow();
  }
}
