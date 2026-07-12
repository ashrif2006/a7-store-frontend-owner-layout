import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast = signal<ToastMessage | null>(null);

  private hideTimer: any = null;

  show(text: string, type: 'success' | 'error' | 'info' = 'success', durationMs = 3000) {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.toast.set({ text, type });
    this.hideTimer = setTimeout(() => {
      this.toast.set(null);
      this.hideTimer = null;
    }, durationMs);
  }

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error', 5000);
  }

  info(text: string) {
    this.show(text, 'info');
  }

  dismiss() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.toast.set(null);
  }
}
