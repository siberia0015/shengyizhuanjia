import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./category/category-list/category-list.module').then( m => m.CategoryListPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./category/category-add/category-add.module').then( m => m.CategoryAddPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./category/category-edit/category-edit.module').then( m => m.CategoryEditPageModule)
  },
  {
    path: 'name-edit',
    loadChildren: () => import('./category/category-name-edit/category-name-edit.module').then( m => m.CategoryNameEditPageModule)
  },
  {
    path: 'product-add',
    loadChildren: () => import('./product-add/product-add.module').then( m => m.ProductAddPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('./product-list/product-list.module').then( m => m.ProductListPageModule)
  },
  {
    path: 'product-detail',
    loadChildren: () => import('./product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'product-edit',
    loadChildren: () => import('./product-edit/product-edit.module').then( m => m.ProductEditPageModule)
  },
  {
    path: 'product-storage',
    loadChildren: () => import('./product-storage/product-storage.module').then( m => m.ProductStoragePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule {}
