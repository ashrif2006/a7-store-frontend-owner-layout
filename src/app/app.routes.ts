import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./landing/landing.component').then((c) => c.LandingComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/register/register.component').then((c) => c.RegisterComponent),
  },
  {

    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layouts/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/product-list/product-list.component').then(
            (c) => c.ProductListComponent
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./products/product-form/product-form.component').then(
            (c) => c.ProductFormComponent
          ),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./products/product-form/product-form.component').then(
            (c) => c.ProductFormComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/order-list/order-list.component').then(
            (c) => c.OrderListComponent
          ),
      },
      {
        path: 'store-settings',
        loadComponent: () =>
          import('./store-settings/store-settings.component').then(
            (c) => c.StoreSettingsComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];