import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductData } from '../service/product-data';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  public searchString = '';
  public productList: Product[] = [];
  public productListCached: Product[] = [];
  public searchResult = this.productList;
  public itemId = '';
  public itemName = '';
  public itemPrice = 0;
  public itemQuantity = 1;
  public itemInStock: boolean = true;
  public dialogActive = false;
  public editingItem: any = null;
  public dialogHeader = '';

  constructor(private productService: ProductData) {}

  loadProducts() {
    console.log('loading products...');
    this.productService
      .getProducts()
      .then((fetchedProducts) => {
        console.log('Products fetched');
        this.productList = fetchedProducts;
      })
      .catch((err) => {
        console.log('Fehler beim Laden der Produkte, API-Fehler:', err);
      });
  }

  dialogSwitch(status: boolean) {
    this.dialogActive = status;
    if (!status) {
      this.resetForm();
    }
  }

  // onSearch() {
  //   if (this.searchString.trim()) {
  //     const searchStringlc = this.searchString.toLowerCase();
  //     this.searchResult = this.productList.filter((product) =>
  //       product.name.toLowerCase().includes(searchStringlc)
  //     );
  //   } else this.showAllItems();
  // }

  showAllItems() {
    this.productList = this.productListCached;
    this.searchResult = this.productList;
    this.searchString = '';
  }

  async onSearch() {
    const trimmedSearch = this.searchString?.trim();

    if (trimmedSearch) {
      const searchStringlc = trimmedSearch.toLocaleLowerCase();
      console.log('Suche nach:', searchStringlc);

      try {
        const results = await this.productService.getProducts();
        this.searchResult = results.filter((product) =>
          product.name.toLowerCase().includes(searchStringlc)
        );
        this.productListCached = this.productList;
        this.productList = this.searchResult;
        console.log('Suchergebnisse:', this.searchResult);
      } catch (err) {
        console.error('Fehler beim Suchen', err);
        this.searchResult = [];
      }
    } else {
      this.showAllItems();
    }
  }

  async addItem() {
    this.itemName = this.itemName.trim();

    const newId = this.generateUniqueId();

    const newProduct: Product = {
      id: newId,
      name: this.itemName,
      quantity: this.itemQuantity,
      inStock: this.itemInStock,
      price: this.itemPrice,
    };
    if (newProduct) {
      try {
        this.productList.push(newProduct);
        await this.productService.addProduct(newProduct);
        console.log('Produkt erfolgreich bearbeitet:', newProduct.name);
      } catch (err) {
        console.error('Fehler beim Erstellen des Produkts:', err);

        alert('Produkt konnte nicht erstellt werden.');
        return;
      }
    }
    if (newProduct.quantity == 0) {
      newProduct.inStock = false;
    } else newProduct.inStock = true;
    this.resetForm();
  }
  deleteItem(product: any) {
    console.log(product);
    const index = this.productList.indexOf(product);
    if (index >= 0) {
      this.productList.splice(index, 1);
    }
    const id = this.productList.indexOf(product.id);
    if (id) {
      console.log('delete product');
      this.productService
        .deleteProduct(product.id)
        .then(() => {
          console.log('deleted product' + product.name);
        })
        .catch((err) => {
          console.log('Fehler beim löschen des Produkts, API-Fehler:', err);
        });
    }
  }

  editItem(product: any) {
    this.editingItem = product;
    this.itemId = product.id;
    this.itemName = product.name;
    this.itemQuantity = product.quantity;
    this.itemPrice = product.price;
    this.itemInStock = product.inStock;
    this.dialogSwitch(true);
  }

  async saveItem() {
    if (this.editingItem) {
      console.log(this.editingItem);
      this.editingItem.id = this.itemId;
      this.editingItem.name = this.itemName;
      this.editingItem.quantity = this.itemQuantity;
      this.editingItem.price = this.itemPrice;
      this.editingItem.inStock = this.itemInStock;
      console.log(this.editingItem);

      const id = this.editingItem.id;

      if (id) {
        try {
          await this.productService.editProduct(id, this.editingItem);
          console.log('Produkt erfolgreich bearbeitet:', this.editingItem.name);
        } catch (err) {
          console.error('Fehler beim Bearbeiten des Produkts:', err);

          alert('Produkt konnte nicht aktualisiert werden.');
          return;
        }
      }
      if (this.editingItem.quantity == 0) {
        this.editingItem.inStock = false;
      } else this.editingItem.inStock = true;
      this.resetForm();
    } else {
      this.addItem();
    }
    this.dialogSwitch(false);
  }

  // reset
  resetForm() {
    this.itemId = '';
    this.itemName = '';
    this.itemQuantity = 0;
    this.itemPrice = 0;
    this.itemInStock = false;
    this.editingItem = null;
  }

  // Unique ID Generator
  private generateUniqueId(): string {
    // Schritt 1: Basis aus Zeitstempel (kürzer)
    const timestamp = Date.now().toString(36);

    // Schritt 2: Zufallsstring (Buchstaben + Zahlen)
    const random = Math.random().toString(36).substr(2, 5);

    // Kombinieren und auf 10 Zeichen kürzen
    const id = (timestamp + random).substr(0, 10);

    return id;
  }
  // inStockCheck(products: Product) {
  //   if (products.quantity == 0) {
  //     products.inStock = false;
  //   } else products.inStock = true;
  // }
  // test
  test() {
    let a: number = 5;
    let b: number = 0;
    let c: number;
    let e: number;
    const d = 20;

    a = 5;
    b = 6;
    c = a + b + d + 5;
    c = this.test2(a, b);
    c = this.test2(a);
    e = this.test3(a, b, c);
    console.log(e);
  }
  test2(x: number, y: number = 0): number {
    let c: number;
    c = x + y + 20;
    return c;
  }
  test3(a: number = 7, b: number = 92, c: number) {
    let e: number;
    e = a * b + c + 20;
    return e;
  }
}
