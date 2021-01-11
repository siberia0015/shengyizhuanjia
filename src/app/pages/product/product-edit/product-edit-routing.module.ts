import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductEditPage } from './product-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ProductEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductEditPageRoutingModule {}
