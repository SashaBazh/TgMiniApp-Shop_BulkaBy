import { Component, OnInit } from '@angular/core';
import { Banner } from '../../interfaces/_Admin/banner.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banners-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './banners-admin.component.html',
  styleUrl: './banners-admin.component.css'
})
export class BannersAdminComponent implements OnInit {
  banners: Banner[] = [];
  bannerForm: FormGroup;
  selectedBanner: Banner | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.bannerForm = this.fb.group({
      link: [''],
      category: ['', Validators.required],
      image: [null],
    });
  }

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.http.get<Banner[]>('/api/banner').subscribe({
      next: (banners) => (this.banners = banners),
      error: (err) => console.error('Failed to load banners', err),
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.imageFile);
    }
  }

  createBanner(): void {
    if (this.bannerForm.invalid || !this.imageFile) {
      alert('Please fill all required fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('banner_data', JSON.stringify(this.bannerForm.value));
    formData.append('image', this.imageFile);

    this.http.post('/api/banner', formData).subscribe({
      next: () => {
        this.bannerForm.reset();
        this.imageFile = null;
        this.imagePreview = null;
        this.loadBanners();
        alert('Banner created successfully.');
      },
      error: (err) => console.error('Failed to create banner', err),
    });
  }

  editBanner(banner: Banner): void {
    this.selectedBanner = banner;
    this.bannerForm.patchValue({
      link: banner.link,
      category: banner.category,
    });
    this.imagePreview = banner.image;
  }

  updateBanner(): void {
    if (!this.selectedBanner) return;

    const formData = new FormData();
    formData.append('banner_data', JSON.stringify({ ...this.bannerForm.value, id: this.selectedBanner.id }));

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.http.put('/api/banner', formData).subscribe({
      next: () => {
        this.selectedBanner = null;
        this.bannerForm.reset();
        this.imageFile = null;
        this.imagePreview = null;
        this.loadBanners();
        alert('Banner updated successfully.');
      },
      error: (err: any) => console.error('Failed to update banner', err),
    });
  }

  deleteBanner(banner: Banner): void {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    this.http.delete(`/api/banner/${banner.id}`).subscribe({
      next: () => {
        this.loadBanners();
        alert('Banner deleted successfully.');
      },
      error: (err: any) => console.error('Failed to delete banner', err),
    });
  }
}

