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
  { path: '**', redirectTo: '/home' },
];
