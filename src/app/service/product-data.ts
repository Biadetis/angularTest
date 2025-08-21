import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  inStock: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ProductData {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // getPosts(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
  // addPost(post: any): Observable<any> {
  //   return this.http.post<any>(this.apiUrl, post);
  // }

  // public getProduct(id: string): Product {
  //   const product: Product = {
  //     id: '1',
  //     name: '',
  //     quantity: 1,
  //     price: 1,
  //     inStock: true,
  //   };
  //   return product;
  // }

  public getProducts(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(this.apiUrl));
  }

  public deleteProduct(id: string) {
    return firstValueFrom(this.http.delete<Product>(`${this.apiUrl}/${id}`));
  }

  public editProduct(id: string, updatedProduct: Product): Promise<Product> {
    return firstValueFrom(
      this.http.put<Product>(`${this.apiUrl}/${id}`, updatedProduct)
    );
  }

  public addProduct(product: Product): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(`${this.apiUrl}`, product));
  }

  public onSearch(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(this.apiUrl));
  }
}
