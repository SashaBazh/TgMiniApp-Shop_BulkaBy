import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { SlideImage } from '../../../interfaces/_Home/image-slider.interface';

@Component({
  selector: 'app-images-sliders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './images-sliders.component.html',
  styleUrl: './images-sliders.component.css'
})
export class ImagesSlidersComponent {
  images: SlideImage[] = [
    {
      url: '../../../../assets/image-slider/baner02.jpg',
      alt: 'Highway in mountains'
    },
  ];

  secondImages: SlideImage[] = [
    {
      url: '../../../../assets/image-slider/baner03.jpg',
      alt: 'Highway in mountains'
    },
  ];

  currentIndex = 0;
  secondCurrentIndex = 0;
  private intervalId: number | undefined;
  private secondIntervalId: number | undefined;
  private imagesLoaded = false;
  private secondImagesLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.preloadImages();
      this.preloadSecondImages();
    }
  }

  ngOnDestroy() {
    this.stopSlideshow();
    this.stopSecondSlideshow();
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

  private preloadSecondImages() {
    const imagePromises = this.secondImages.map(image => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });
    });

    Promise.all(imagePromises).then(() => {
      this.secondImagesLoaded = true;
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
