import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// import { ProductList } from './app/product-list/product-list';

export interface Product {
  name: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class Data {
  private dataUrl = 'assets/data.json';
  private products: Product[] = [];
  constructor(private http: HttpClient) {}

  getData(): Observable<Product[]> {
    return this.http.get<Product[]>(this.dataUrl).pipe(
      catchError((error) => {
        console.error('error', error);
        return of([]);
      })
    );
  }

  dataOutput(Product: any) {
    console.log(JSON.stringify(Product, null, 2));
    Product = JSON.stringify(Product);
    localStorage.setItem('products', Product);
    let text = localStorage.getItem('products');
    let ProductObj = JSON.parse(text);
    document.getElementById('Product').innerHTML = ProductObj.name;
  }
}
