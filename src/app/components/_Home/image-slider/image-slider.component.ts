import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SlideImage } from '../../../interfaces/_Home/image-slider.interface';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css'
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  images: SlideImage[] = [
    {
      url: '../../../../assets/image-slider/baner1.png',
      alt: 'Highway in mountains'
    }

  ];

  currentIndex = 0;
  private intervalId: number | undefined;
  private imagesLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  get currentImage(): SlideImage {
    return this.images[this.currentIndex];
  }

  ngOnInit() {
    // Задержка инициализации слайдшоу до загрузки изображений
    if (isPlatformBrowser(this.platformId)) {
      this.preloadImages();
    }
  }

  ngOnDestroy() {
    this.stopSlideshow();
  }

  private preloadImages() {
    const imagePromises = this.images.map(image => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });
    });

    Promise.all(imagePromises).then(() => {
      this.imagesLoaded = true;
      this.startSlideshow();
      this.cdr.detectChanges();
    });
  }

  onImageLoad() {
    if (isPlatformBrowser(this.platformId)) {
      this.cdr.detectChanges();
    }
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