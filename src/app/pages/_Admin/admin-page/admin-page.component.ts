import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from '../../../admincomponents/categories/categories.component';
import { ProductsComponent } from '../../../admincomponents/products/products.component';
import { FiltersComponent } from '../../../admincomponents/filters/filters.component';
import { SalesComponent } from '../../../admincomponents/sales/sales.component';
import { BannersAdminComponent } from "../../../admincomponents/banners-admin/banners-admin.component";

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesComponent,
    ProductsComponent,
    FiltersComponent,
    SalesComponent,
    BannersAdminComponent
],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent {
  // Define an enum for active tabs
  ActiveTab = {
    CATEGORIES: 'categories',
    PRODUCTS: 'products',
    FILTERS: 'filters',
    SALES: 'sales', 
    BANNERS: 'banners'// Добавлено
  };

  // Track the current active tab
  currentTab: string = this.ActiveTab.CATEGORIES;

  // Method to switch tabs
  setActiveTab(tab: string) {
    this.currentTab = tab;
  }
}
