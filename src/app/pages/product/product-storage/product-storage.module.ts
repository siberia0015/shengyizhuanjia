import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductStoragePageRoutingModule } from './product-storage-routing.module';

import { ProductStoragePage } from './product-storage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductStoragePageRoutingModule
  ],
  declarations: [ProductStoragePage]
})
export class ProductStoragePageModule {}
