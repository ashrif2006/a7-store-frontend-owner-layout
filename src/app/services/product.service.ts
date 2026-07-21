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
  isLoading = signal(false);

    constructor() { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`)
  }

  getProductById(id:string){
    return this.products().find(product => product.id === id)?? null ;
  }

  setProducts(products:Product[]){
    this.products.set(products)
    localStorage.setItem('products' , JSON.stringify(products));
  }
  addProduct(product:Product){
    this.products.update(products=> [product,...products])
  }
  updateProductInSignal(product:Product){
    this.products.update(products => 
      products.map(p =>
        p.id === product.id? product : p
      )
    )
  }
  loadProducts():void{
    if(this.products().length)
      return

    this.isLoading.set(true);
    this.getProducts().subscribe({
      next:(products)=>{
        this.setProducts(products);
        this.isLoading.set(false);
      },
      error:(err)=>{
        console.error(err);
        this.isLoading.set(false);
      }
    })
  }

  createProduct(formData:FormData){
    return this.http.post<Product>(`${environment.apiUrl}/products`,formData)

  }

  updateProduct(id:string , product:Partial<Product>){
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`,product);
  }

  setUpdateProduct(product:Product){
    localStorage.setItem("updateProductStorage",JSON.stringify(product));
  }
  getUpdateProduct(){
    const product = localStorage.getItem('updateProductStorage');
    if(!product) return null;
    return JSON.parse(product);
  }
  clearUpdateProduct(){
    localStorage.removeItem("updateProductStorage");
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
