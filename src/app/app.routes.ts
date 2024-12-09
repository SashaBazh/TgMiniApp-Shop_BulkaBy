import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./pages/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'catalog/:category',
    loadComponent: () =>
      import('./pages/productsincatalog/productsincatalog.component').then((m) => m.ProductsincatalogComponent),
  },
  {
    path: 'catalog/:category/:id',
    loadComponent: () =>
      import('./pages/product/product.component').then((m) => m.ProductComponent),
  },
  {
    path: 'product1',
    loadComponent: () =>
      import('./pages/product/product.component').then((m) => m.ProductComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'cart/address',
    loadComponent: () =>
      import('./pages/address/address.component').then((m) => m.AddressComponent),
  },
  {
    path: 'cart/address/payment',
    loadComponent: () =>
      import('./pages/payment-method/payment-method.component').then(
        (m) => m.PaymentMethodComponent
      ),
  },
  {
    path: 'cart/address/payment/modal',
    loadComponent: () =>
      import('./components/_PaymentMethod/payment-modal/payment-modal.component').then(
        (m) => m.PaymentModalComponent
      ),
  },
  {
    path: 'payment-link',
    loadComponent: () =>
      import('./components/_PaymentMethod/payment-link/payment-link.component').then(
        (m) => m.PaymentLinkComponent
      ),
  },
  {
    path: 'profile/my-purchases',
    loadComponent: () =>
      import('./pages/purchases/purchases.component').then((m) => m.PurchasesComponent
      ),
  },
  




  // Admin panel routes
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/_Admin/admin-page/admin-page.component').then((m) => m.AdminPageComponent),
  },
  {
    path: 'admin/categories',
    loadComponent: () =>
      import('./admincomponents/categories/categories.component').then((m) => m.CategoriesComponent),
  },
  {
    path: 'admin/products',
    loadComponent: () =>
      import('./admincomponents/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'admin/filters',
    loadComponent: () =>
      import('./admincomponents/filters/filters.component').then((m) => m.FiltersComponent),
  },
  {
    path: 'admin/banners',
    loadComponent: () =>
      import('./admincomponents/banners-admin/banners-admin.component').then((m) => m.BannersAdminComponent),
  },
  
  // { path: '**', redirectTo: '/home' },
];
