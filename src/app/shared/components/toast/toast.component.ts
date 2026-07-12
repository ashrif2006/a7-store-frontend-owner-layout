import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `
    @if (toastService.toast(); as toast) {
      <div class="toast-container position-fixed top-0 start-50 translate-middle-x mt-4" style="z-index:9999;">
        <div
          class="toast show align-items-center border-0"
          [style.background]="bgColor(toast.type)"
          style="color:#fff; border-radius:var(--r-sm); min-width:280px; animation: toastSlideIn 0.3s ease-out;">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
              <i [class]="iconClass(toast.type)" [style.color]="iconColor(toast.type)"></i>
              <span>{{ toast.text }}</span>
            </div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              (click)="toastService.dismiss()">
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateY(-12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  bgColor(type: string): string {
    switch (type) {
      case 'success': return 'var(--ink)';
      case 'error':   return '#dc3545';
      case 'info':    return 'var(--ink)';
      default:        return 'var(--ink)';
    }
  }

  iconClass(type: string): string {
    switch (type) {
      case 'success': return 'fa-solid fa-circle-check';
      case 'error':   return 'fa-solid fa-circle-exclamation';
      case 'info':    return 'fa-solid fa-circle-info';
      default:        return 'fa-solid fa-circle-check';
    }
  }

  iconColor(type: string): string {
    switch (type) {
      case 'success': return 'var(--accent)';
      case 'error':   return '#fff';
      case 'info':    return '#3b82f6';
      default:        return 'var(--accent)';
    }
  }
}
