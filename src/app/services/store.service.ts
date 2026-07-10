import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, StoreResponse, UpdateStoreRequest, updateStoreResponse } from '../models/store.interface';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private http = inject(HttpClient);

  readonly store = signal<Store | null>(null);

  getStore() {
    return this.http.get<StoreResponse>(`${environment.apiUrl}/store/me`);
  }

  setStore(store: Store) {
    this.store.set(store);
  }

  loadStore(){
    if(this.store())
      return;
    this.getStore().subscribe({
      next:(res)=>{
        this.setStore(res.store);
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  updateStore(data:UpdateStoreRequest):Observable<updateStoreResponse>{
    return this.http.put<updateStoreResponse>(`${environment.apiUrl}/store`, data);
  }

  uploadLogo(file:File){
    const formData = new FormData();
    formData.append('logo',file);
    return this.http.post<any>(`${environment.apiUrl}/store/logo`,formData)
  }

  clearStore() {
    this.store.set(null);
  }

}