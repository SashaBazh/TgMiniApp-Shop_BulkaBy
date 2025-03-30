import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from '../../../admincomponents/categories/categories.component';
import { ProductsComponent } from '../../../admincomponents/products/products.component';
import { FiltersComponent } from '../../../admincomponents/filters/filters.component';
import { SalesComponent } from '../../../admincomponents/sales/sales.component';
import { BannersAdminComponent } from "../../../admincomponents/banners-admin/banners-admin.component";

enum ActiveTab {
  CATEGORIES = 'Категории',
  PRODUCTS = 'Товары',
  FILTERS = 'Фильтры',
  SALES = 'Акции',
  BANNERS = 'Реклама'
}

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
  ActiveTab = ActiveTab; 
  currentTab: ActiveTab = ActiveTab.CATEGORIES;

  setActiveTab(tab: ActiveTab) {
    this.currentTab = tab;
  }
}
