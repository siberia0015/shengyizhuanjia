import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductStoragePage } from './product-storage.page';

const routes: Routes = [
  {
    path: '',
    component: ProductStoragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductStoragePageRoutingModule {}
