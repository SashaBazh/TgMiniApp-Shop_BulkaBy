import { Component, OnInit } from '@angular/core';
import { Banner } from '../../interfaces/_Admin/banner.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BannerService } from '../../services/_Admin/banner.service';
import { ImageStreamService } from '../../services/_Image/image-stream.service';

@Component({
  selector: 'app-banners-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './banners-admin.component.html',
  styleUrl: './banners-admin.component.css'
})
export class BannersAdminComponent implements OnInit {
  banners: Banner[] = [];
  selectedBanner: Banner | null = null;
  newImages: File[] = [];

  constructor(public bannerService: BannerService, public imageService: ImageStreamService) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.bannerService.getBanners().subscribe({
      next: (banners) => (this.banners = banners),
      error: (err) => console.error('Failed to load banners', err),
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newImages = Array.from(input.files);
    }
  }

  editBanner(banner: Banner): void {
    this.selectedBanner = banner;
  }

  updateBanner(): void {
    if (!this.selectedBanner) {
      alert('No banner selected for update.');
      return;
    }

    this.bannerService.updateBanner(
      { id: this.selectedBanner.id, category: this.selectedBanner.category },
      this.newImages
    ).subscribe({
      next: () => {
        this.selectedBanner = null;
        this.newImages = [];
        this.loadBanners();
        alert('Banner updated successfully.');
      },
      error: (err) => console.error('Failed to update banner', err),
    });
  }
}