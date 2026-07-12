import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProductService } from '../../services/product.service';

interface PreviewImage {
  url: string;
  file: File;
}
interface ProductImage {
  image_url: string;
  sort_order: number;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  readonly MAX_IMAGES = 3;

  // ── Mode detection ──
  isEditMode = signal(false);
  editingId = signal<string | null>(null);

  // ── UI state ──
  isSaving = signal(false);
  errorMsg = signal('');
  isDragging = signal(false);
  previewImages = signal<PreviewImage[]>([]);
  existingImages = signal<ProductImage[]>([]); // edit mode only

  productForm: FormGroup;

  // ── Computed discount preview ──
  discountPreview = computed(() => {
    const price = parseFloat(this.productForm?.get('price')?.value);
    const salePrice = parseFloat(this.productForm?.get('sale_price')?.value);
    if (price > 0 && salePrice > 0 && salePrice < price) {
      return Math.round((1 - salePrice / price) * 100);
    }
    return null;
  });

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      sale_price: [null],
      stock: [1, [Validators.required, Validators.min(0)]],
      is_available: [true],
    });
  }

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  if (!id) return;

  this.isEditMode.set(true);
  this.editingId.set(id);

  let product = this.productService.getProductById(id);

  if (!product) {
    product = this.productService.getUpdateProduct();
  }

  if (!product) return;

  this.productForm.patchValue({
    name: product.name,
    description: product.description,
    price: product.price,
    sale_price: product.sale_price,
    stock: product.stock,
    is_available: product.is_available,
  });
}

  isInvalid(field: string): boolean {
    const ctrl = this.productForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ── Image handling (create mode only) ──
  onFilesSelected(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    this.addFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    this.addFiles(files);
  }

  private addFiles(files: File[]) {
    const remaining = this.MAX_IMAGES - this.previewImages().length;
    if (remaining <= 0) {
      this.errorMsg.set(`أقصى عدد صور هو ${this.MAX_IMAGES}`);
      return;
    }

    const toAdd = files
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImages.update((imgs) => [
          ...imgs,
          { url: e.target?.result as string, file },
        ]);
      };
      reader.readAsDataURL(file);
    });

    this.errorMsg.set('');
  }

  removePreviewImage(index: number) {
    this.previewImages.update((imgs) => imgs.filter((_, i) => i !== index));
  }

  // ── Save — wire to ProductService later ──
  onSave() {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) return;
    this.isSaving.set(true);
    this.errorMsg.set('');

    const formValue = this.productForm.getRawValue();
    const imageFiles = this.previewImages().map((p) => p.file);

    if (this.isEditMode()) {
      this.productService
        .updateProduct(this.editingId()!, formValue)
        .subscribe({
          next: (updateProduct) => {
            this.productService.updateProductInSignal(updateProduct);
            this.isSaving.set(false);
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.isSaving.set(false);
            this.errorMsg.set(err.error?.message || 'حدث خطء ');
          },
        });
    } else {
      const formData = new FormData();
      formData.append('name', formValue.name);
      formData.append('description', formValue.description);
      formData.append('price', formValue.price.toString());
      formData.append('stock', formValue.stock.toString());
      formData.append('is_available', formValue.is_available);
      if (formValue.sale_price)
        formData.append('sale_price', formValue.sale_price);
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      this.productService.createProduct(formData).subscribe({
        next: (product) => {
          this.productService.addProduct(product);
          this.isSaving.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMsg.set(err.error?.message || 'حدث خطء حاول مره اخرى');
        },
      });
    }
  }
}
