import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  products = signal<Product[]>([]);

    constructor() { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`)
  }

  setProducts(products:Product[]){
    this.products.set(products)
  }
  loadProducts():void{
    if(this.products().length)
      return

    this.getProducts().subscribe({
      next:(products)=>{
        this.setProducts(products);
      }
    })
  }

  deleteProduct(id:string){
    return this.http.delete(`${environment.apiUrl}/products/${id}`)
  }

  removeProduct(id: string) {
  this.products.update(products =>
    products.filter(product => product.id !== id)
  );
}

  clearProducts():void{
    this.products.set([])
  }

}
