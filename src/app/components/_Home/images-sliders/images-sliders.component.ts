import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SlideImage } from '../../../interfaces/_Home/image-slider.interface';
import { BanerService } from '../../../services/_Baner/baner.service';
import { ImageStreamService } from '../../../services/_Image/image-stream.service';

@Component({
  selector: 'app-images-sliders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './images-sliders.component.html',
  styleUrl: './images-sliders.component.css'
})
export class ImagesSlidersComponent implements OnInit, OnDestroy {
  images: SlideImage[] = [];
  secondImages: SlideImage[] = [];
  currentIndex = 0;
  secondCurrentIndex = 0;
  private intervalId: number | undefined;
  private secondIntervalId: number | undefined;
  public imagesLoaded = false;
  public secondImagesLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private bannerService: BanerService,
    private imageService: ImageStreamService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadImagesFromService();
      this.loadSecondImagesFromService();
    }
  }

  ngOnDestroy() {
    this.stopSlideshow();
    this.stopSecondSlideshow();
  }

  private loadImagesFromService() {
    this.bannerService.getBannerById(3).subscribe({
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

  private loadSecondImagesFromService() {
    this.bannerService.getBannerById(4).subscribe({
      next: (banner) => {
        this.secondImages = banner.media.map((mediaUrl) => ({
          url: this.imageService.getImageUrl(mediaUrl),
          alt: banner.category || 'Banner Image'
        }));
        this.preloadSecondImages();
      },
      error: (err) => {
        console.error('Failed to load second banner', err);
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

  private preloadSecondImages() {
    const imagePromises = this.secondImages.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });
    });
  
    Promise.all(imagePromises).then(() => {
      this.secondImagesLoaded = true; // Устанавливаем флаг загрузки
      this.startSecondSlideshow();
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

  private startSecondSlideshow() {
    if (!this.secondImagesLoaded) return;

    this.secondIntervalId = window.setInterval(() => {
      this.nextSecond();
      this.cdr.detectChanges();
    }, 5000);
  }

  private stopSlideshow() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  private stopSecondSlideshow() {
    if (this.secondIntervalId) {
      window.clearInterval(this.secondIntervalId);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  nextSecond() {
    this.secondCurrentIndex = (this.secondCurrentIndex + 1) % this.secondImages.length;
  }

  setIndex(index: number) {
    this.currentIndex = index;
    this.stopSlideshow();
    this.startSlideshow();
  }

  setSecondIndex(index: number) {
    this.secondCurrentIndex = index;
    this.stopSecondSlideshow();
    this.startSecondSlideshow();
  }
}