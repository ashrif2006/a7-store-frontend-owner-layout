import { Component, signal, computed, ViewChild, ElementRef, inject, OnInit, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { StoreService } from '../services/store.service';
import { UpdateStoreRequest, updateStoreResponse } from '../models/store.interface';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-store-settings',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, NgIf, SpinnerComponent],
  templateUrl: './store-settings.component.html',
  styleUrl: './store-settings.component.css',
})
export class StoreSettingsComponent implements OnInit {

  @ViewChild('saveToast') saveToastEl!: ElementRef;

  // ── UI state — wire to StoreService later ──
  isLoading = signal(true);
  isSaving = signal(false);
  errorMsg = signal('');
  isFirstSetup = signal(true);       // set false after first save
  logoPreviewUrl = signal<string | null>(null);
  selectedLogoFile: File | null = null;
  logoRemoved = false;
  deleteConfirmText = '';

  settingsForm: FormGroup;
  storeService = inject(StoreService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    if (this.storeService.store()) {
      this.isLoading.set(false);
    } else {
      this.isLoading.set(true);
      this.storeService.getStore().subscribe({
        next: (res) => {
          this.storeService.setStore(res.store);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      });
    }
  }

  // computed initial from store name
  nameInitial = computed(() => {
    const name = this.settingsForm?.get('name')?.value as string;
    return name ? name[0] : 'م';
  });

  constructor() {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      whatsapp_number: ['', [Validators.pattern(/^[0-9]{10,11}$/)]],
      email: [{ value: '', disabled: true }],
    });

    effect(() => {
      const currentStore = this.storeService.store();
      if (currentStore) {
        this.settingsForm.patchValue({
          name: currentStore.name,
          slug: currentStore.slug,
          whatsapp_number: currentStore.whatsapp_number
        });
        this.logoPreviewUrl.set(currentStore.logo_url)
      }
    },
      { allowSignalWrites: true }
    )
  }

  isInvalid(field: string): boolean {
    const ctrl = this.settingsForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ── Logo handling ──
  onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedLogoFile = file;
    this.logoRemoved = false;
    const reader = new FileReader();
    reader.onload = (e) => this.logoPreviewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removeLogo(event: Event) {
    event.stopPropagation();
    this.logoPreviewUrl.set(null);
    this.selectedLogoFile = null;
    this.logoRemoved = true;
  }

  uploadLogo() {
    if (!this.selectedLogoFile) return;

    this.storeService.uploadLogo(this.selectedLogoFile).subscribe({
      next: (res) => {
        this.storeService.setStore(res.store);
        this.isSaving.set(false);
        this.isFirstSetup.set(false);
        this.showSuccessToast();
      },
      error: (err) => {
        console.log(err);
        this.isSaving.set(false);
        this.errorMsg.set('حدث خطأ أثناء رفع الشعار');
      },
    });
  }

  dismissBanner() { this.isFirstSetup.set(false); }

  private showSuccessToast() {
    if (this.saveToastEl && this.saveToastEl.nativeElement) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        const toast = bootstrap.Toast.getOrCreateInstance(this.saveToastEl.nativeElement);
        toast.show();
      }
    }
  }

  // ── Save — wire to StoreService later ──
  onSave() {
    this.settingsForm.markAllAsTouched();
    if (this.settingsForm.invalid) return;

    this.isSaving.set(true);
    this.errorMsg.set('');

    const data: UpdateStoreRequest = {
      name: this.settingsForm.value.name!,
      slug: this.settingsForm.value.slug!,
      whatsapp_number: this.settingsForm.value.whatsapp_number!,
      telegram_chat_id: null
    };

    this.storeService.updateStore(data).subscribe({
      next: (res) => {
        console.log(res)
        this.storeService.setStore(res.store);
        if (this.selectedLogoFile) {
          this.uploadLogo();
          return;
        }
        this.isSaving.set(false);
        this.isFirstSetup.set(false);
        this.showSuccessToast();
      },
      error: (err) => {
        console.log(err);
        this.isSaving.set(false);
        this.errorMsg.set('حدث خطأ أثناء حفظ التغييرات');
      }
    })

  }

  // ── Delete — wire to StoreService later ──
  onDeleteStore() {
    // TODO: call StoreService.deleteStore() then navigate to landing
  }
}