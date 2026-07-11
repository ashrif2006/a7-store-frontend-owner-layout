import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { PageTitleService } from '../../services/pageTitle.service';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent   {
  private pageTitleService = inject(PageTitleService)

  readonly MAX_PRODUCTS = 15;

  // ── UI state ──
  isLoading    = signal(false);
  isDeleting   = signal(false);
  activeFilter = signal<'all' | 'available' | 'out'>('all');
  searchQuery  = '';
  skeletons    = Array(8).fill(0);
  productToDelete = signal<Product | null>(null);

  productService = inject(ProductService);

  products = this.productService.products;

  ngOnInit(){
    this.productService.loadProducts();
    this.pageTitleService.setTitle("المنتجات")

  }
  filteredProducts = computed(() => {
    let list = this.products();

    if (this.activeFilter() === 'available') {
      list = list.filter(p => p.is_available && p.stock > 0);
    } else if (this.activeFilter() === 'out') {
      list = list.filter(p => p.stock <= 0);
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));

    return list;
  });

  // ── Filter chips config ──
  filterChips = [
    { key: 'all'       as const, label: 'الكل' },
    { key: 'available' as const, label: 'متاح' },
    { key: 'out'       as const, label: 'نفد المخزون' },
  ];

  getCount(key: 'all' | 'available' | 'out'): number {
    const list = this.products();
    if (key === 'available') return list.filter(p => p.is_available && p.stock > 0).length;
    if (key === 'out')       return list.filter(p => p.stock <= 0).length;
    return list.length;
  }

  setFilter(key: 'all' | 'available' | 'out') {
    this.activeFilter.set(key);
  }

  onSearch() {
    // triggers filteredProducts recompute via searchQuery binding
    // if you want a signal-based approach later, convert searchQuery to signal
  }

  // ── Delete flow — wire to ProductService later ──
  openDeleteModal(product: Product) {

  }

  confirmDelete() {
    // if (!this.productToDelete()) return;
    // // TODO: call ProductService.deleteProduct(id) then remove from signal
    // // this.products.update(list => list.filter(p => p.id !== this.productToDelete()!.id));
    // // this.productToDelete.set(null);
  }
}