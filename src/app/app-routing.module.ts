import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StartAppGuard } from './core/start-app.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'guide',
    pathMatch: 'full'
  },
  {
    path: 'guide',
    loadChildren: './pages/guide/guide.module#GuidePageModule',
    canActivate: [StartAppGuard]
  },
  {
    path: 'home',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'passport',
    loadChildren: () => import('./pages/passport/passport.module').then( m => m.PassportModule)
  },
  {
    path: 'me',
    loadChildren: () => import('./pages/me/me.module').then( m => m.MePageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'base',
    loadChildren: () => import('./pages/base/base.module').then( m => m.BasePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
