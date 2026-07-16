# A7-Store — Owner Dashboard (Angular)

A production-ready store management dashboard built with **Angular 17+**, as part of the A7-Store multi-tenant e-commerce platform. Store owners use this dashboard to manage their products, track orders, and configure their store settings.

> **Note:** The UI design and component architecture were designed in collaboration with **Claude (Anthropic AI)**. The business logic, API integration, services, guards, interceptors, and state management were fully implemented by the developer.

---

## What This Project Demonstrates

This project was built to showcase a clear separation of concerns between **UI/UX design** and **application logic** — a skill that reflects real-world team collaboration (designer ↔ developer).

### Developer's Contributions
- ✅ Angular architecture design (standalone components, signals, services)
- ✅ All HTTP services (`AuthService`, `StoreService`, `ProductService`, `OrderService`)
- ✅ JWT Auth Interceptor (auto-attaches token to every request)
- ✅ Auth Guard (route protection)
- ✅ Reactive state management using Angular Signals
- ✅ Reactive Forms with validation
- ✅ Optimistic UI updates (order status changes reflect instantly)
- ✅ Smart data caching (store data loaded once, shared via signal across all components)
- ✅ Full integration with a custom Node.js + Prisma backend

### AI-Assisted (Claude)
- 🎨 HTML templates and component structure
- 🎨 CSS design system (tokens, typography, component styles)
- 🎨 Bootstrap 5 integration and layout decisions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17+ (Standalone Components) |
| State | Angular Signals |
| Forms | Reactive Forms |
| Styling | Bootstrap 5 + Custom CSS (no SCSS) |
| Icons | Font Awesome 6 |
| HTTP | Angular `HttpClient` + Interceptors |
| Auth | JWT (stored in `localStorage`) |
| Backend | Node.js + Express + Prisma + PostgreSQL |
| Deployment | Vercel |

---

## Project Structure

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts              # Protects all dashboard routes
│   └── interceptors/
│       └── auth.interceptor.ts        # Auto-attaches JWT to every request
│
├── services/
│   ├── auth.service.ts                # Login, register, token management
│   ├── store.service.ts               # Store profile, logo, settings
│   ├── product.service.ts             # Product CRUD + image upload
│   └── order.service.ts               # Orders + status transitions
│
├── landing/                           # Public marketing page
├── auth/
│   ├── login/
│   └── register/
│
├── dashboard/                         # Stats overview (calls /dashboard/stats)
├── products/
│   ├── product-list/                  # Grid view, search, filter, delete
│   └── product-form/                  # Add / edit (same component, dual mode)
├── orders/
│   └── order-list/                    # Order management + status workflow
├── store-settings/                    # Store profile, logo, WhatsApp config
│
├── shared/
│   ├── layouts/
│   │   └── dashboard-layout/          # Sidebar + topbar shell
│   └── components/
│       ├── sidebar/
│       └── topbar/
│
├── app.routes.ts
└── app.config.ts
```

---

## Key Technical Decisions

### 1. Angular Signals over NgRx
The app uses Angular's built-in **Signals** for reactive state — no NgRx needed. This keeps the codebase lean while still achieving:
- Zero duplicate API requests (store data fetched once, read everywhere)
- Automatic UI updates when state changes
- Computed values that recalculate only when dependencies change

```typescript
// Store data fetched once in DashboardLayout
ngOnInit() {
  this.storeService.loadStore(); // no-op if already loaded
}

// Sidebar and Topbar read directly from the signal — no request
store = this.storeService.store; // Signal<Store | null>
```

### 2. Smart Cache with Signals

```typescript
loadStore() {
  if (this.store()) return; // already loaded → skip request
  this.getStore().subscribe({
    next: (res) => this.setStore(res.store),
  });
}
```

### 3. Per-Button Loading State (Orders)
Each status action button tracks its own loading state independently, so pressing "Accept" shows a spinner only on that button — not on every button in the order.

```typescript
// key format: "orderId_NEWSTATUS"
updatingOrderId = signal<string | null>(null);

isUpdating(orderId: string, status: string): boolean {
  return this.updatingOrderId() === `${orderId}_${status}`;
}
```

### 4. Optimistic Updates
Order status changes are reflected in the UI immediately, then confirmed (or reverted) when the server responds.

### 5. Dual-Mode Product Form
A single `ProductFormComponent` handles both **create** and **edit** modes — determined by the presence of an `:id` route parameter.

```typescript
ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.isEditMode.set(true);
    // fetch product and patchValue the form
  }
}
```

### 6. HTTP Interceptor
JWT is attached automatically to every outgoing request — no manual header management in any service.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

---

## Backend Integration

This dashboard connects to a custom REST API:

| Feature | Endpoint |
|---|---|
| Auth | `POST /api/auth/login` · `POST /api/auth/register` |
| Store | `GET /api/store/me` · `PUT /api/store` · `POST /api/store/logo` |
| Products | `GET/POST /api/products` · `PUT/DELETE /api/products/:id` |
| Orders | `GET /api/dashboard/orders` · `PUT /api/orders/:id/status` |
| Dashboard Stats | `GET /api/dashboard/stats` |

### Dashboard Stats Endpoint
Instead of fetching all products and orders to compute stats on the client, a dedicated `/dashboard/stats` endpoint returns pre-computed aggregates using `Promise.all` parallel Prisma queries — a single round-trip regardless of data size.

---

## Running Locally

```bash
npm install
ng serve
```

Make sure `src/environments/environment.ts` points to your backend:

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

---

## Deployment

Deployed on **Vercel** as a static Angular build.

```bash
ng build --configuration production
```

Set the output directory to `dist/your-app-name/browser` in the Vercel project settings.

---

## Screenshots

> *(Add screenshots here once the app is deployed)*

---

## Author

**Ashrif** — Angular developer focused on clean architecture, reactive patterns, and real-world API integration.
