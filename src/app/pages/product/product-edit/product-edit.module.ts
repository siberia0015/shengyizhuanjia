import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductEditPageRoutingModule } from './product-edit-routing.module';

import { ProductEditPage } from './product-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductEditPageRoutingModule
  ],
  declarations: [ProductEditPage]
})
export class ProductEditPageModule {}
