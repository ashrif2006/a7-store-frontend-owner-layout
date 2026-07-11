import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {

  readonly title = signal('لوحه تحكم');

  setTitle(title: string) {
    this.title.set(title);
  }

}