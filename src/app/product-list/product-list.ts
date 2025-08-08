import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  public searchString = '';
  productList = [
    { name: 'noodles', quantity: 1, price: 2.5 },
    { name: 'miso broth', quantity: 1, price: 2 },
    { name: 'egg', quantity: 2, price: 1 },
    { name: 'beef', quantity: 1, price: 5 },
    { name: 'chicken stew', quantity: 1, price: 3 },
    { name: 'cucumber', quantity: 2, price: 1.5 },
  ];
  public searchResult = this.productList;
  public itemName = '';
  public itemPrice = 0;
  public itemQuantity = 1;

  public dialogActive = false;

  public editingItem: any = null;

  dialogSwitch(status: boolean) {
    this.dialogActive = status;
    if (!status) {
      this.editingItem = null;
    }
  }

  onSearch() {
    if (this.searchString.trim()) {
      this.searchResult = this.productList.filter((product) =>
        product.name.includes(this.searchString)
      );
    } else this.showAllItems();
  }

  showAllItems() {
    this.searchResult = this.productList;
    this.searchString = '';
  }

  addItem() {
    this.itemName = this.itemName.trim();
    if (this.itemName) {
      this.productList.push({
        name: this.itemName,
        quantity: this.itemQuantity,
        price: this.itemPrice,
      });
      this.dialogSwitch(false);
    }
  }
  deleteItem(product: any) {
    console.log(product);
    const index = this.productList.indexOf(product);
    if (index >= 0) {
      this.productList.splice(index, 1);
    }
  }

  editItem(product: any) {
    this.editingItem = product;
    this.itemName = product.name;
    this.itemQuantity = product.quantity;
    this.itemPrice = product.price;
    this.dialogSwitch(true);
  }
  saveItem() {
    if (this.editingItem) {
      //edit
      console.log(this.editingItem);
      this.editingItem.name = this.itemName;
      this.editingItem.quantity = this.itemQuantity;
      this.editingItem.price = this.itemPrice;
      console.log(this.editingItem);
      this.editingItem = null;
    } else {
      this.addItem();
    }
    this.dialogSwitch(false);
  }
}
