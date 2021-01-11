import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { AjaxResult } from 'src/app/shared/class/ajax-result';
import { ProductResultRequest } from 'src/app/shared/product-result-request';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product.service';
export const HUANCHUN_KEY = 'Huanchun';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit, OnDestroy {
  currentIndex = 0;
  products: Product[] = [];
  total = 0;
  queryTerm: string;
  categoryId: number = null;
  inventory = 0;
  sum_purchasePrice = 0;
  search: ProductResultRequest;
  subscription: Subscription;
  constructor(private loadingController: LoadingController, private productService: ProductService,
              private categoryService: CategoryService, private localStorageService: LocalStorageService
  ) {
    this.localStorageService.set(HUANCHUN_KEY, true);
    this.initsearch();
    this.subscription = categoryService.watchCategory().subscribe(
      (activeCategory) => {
        this.initsearch();
        this.queryTerm = '';
        this.categoryId = activeCategory.id;
        this.search.searchCategoryId = this.categoryId;
        console.log(this.categoryId);
      },
      (error) => {
      }
    );
    this.localStorageService.set('PRE',  Number(-4) );
  }
  async ngOnInit() {
    console.log('初始化中');
    const loading = await this.loadingController.create({
      message: '正在加载数据，请稍候...',
      spinner: 'bubbles',
    });
    loading.present();
    try {
      this.datarefresh();
      setTimeout(() => {
        loading.dismiss();
      }, 1000);
      console.log(this.products);
    } catch (error) {
      console.log(error);
      // 实际开发中应记录在日志文件中
    }
  }

  // 初始化数据
  ionViewDidEnter(){
    const a = this.localStorageService.get(HUANCHUN_KEY, false);
    if ( Boolean( a ) === false){
      console.log('初始化中');
      this.initsearch();
      this.products= [];
      this.ngOnInit();
      this.localStorageService.set(HUANCHUN_KEY, true);
    }
    this.datarefresh();
  }

  // 初始化搜索
  initsearch(){
    this.search = {
      skipCount: 0,
      maxResultCount: 10,
      searchCategoryId: null,
      searchText: null,
      sortBy: null,
      asc: null
    };
  }

  // 根据当前的搜索策略，调取服务进行搜索
  async getDatafromRequest(a: ProductResultRequest){
    if (a.searchCategoryId) {
      if (a.searchText){
        console.log('search');
        this.getsearchData();
      }else {
        console.log('cate');
        const ajaxResult: AjaxResult = await this.productService.getListByCategoryId(a);
        for (const i of ajaxResult.result.products) {
          this.products.push(i);
        }
        const ajaxResult2: AjaxResult = await this.productService.getProductStatistics(true, a.searchCategoryId);
        this.inventory = ajaxResult2.result.sum_Stock;
        this.sum_purchasePrice = ajaxResult2.result.sum_purchasePrice;
      }
    } else {
      if (a.searchText){
        this.getsearchData();
      }else{
        console.log('list');
        const ajaxResult: AjaxResult = await this.productService.getList(a);
        for (const i of ajaxResult.result.products) {
          this.products.push(i);
        }
        this.total = this.products.length;
        const ajaxResult2: AjaxResult = await this.productService.getProductStatistics();
        this.inventory = ajaxResult2.result.sum_Stock;
        this.sum_purchasePrice = ajaxResult2.result.sum_purchasePrice;
      }
    }
  }

  // 数据刷新
  async datarefresh(){
    this.products = [];
    this.currentIndex = 0;
    this.search.skipCount = 0;
    this.getDatafromRequest(this.search);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // 下拉刷新商品数据
  onRefresh(event) {
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
      this.datarefresh();
    }, 1500);
  }

  // 加载下页商品数据
  async nextloaddata() {
    this.currentIndex = this.products.length;
    this.search.skipCount = this.currentIndex;
    console.log(this.search);
    this.getDatafromRequest(this.search);
  }

  // 上拉加载商品数据
  onInfinite(event) {
    setTimeout(() => {
      console.log('Async operation has endedaa');
      event.target.complete();
      this.nextloaddata();
    }, 1500);
  }
  onInput(event){
  }

  // 搜索商品
  onSearch(){
    console.log(this.queryTerm);
    this.currentIndex = 0;
    this.search = {
      skipCount: 0,
      maxResultCount: 10,
      searchCategoryId: this.categoryId,
      searchText: this.queryTerm,
      sortBy: null,
      asc: null
    };
    this.products = [];
    this.getsearchData();
  }

  // 获取搜索的商品数据
  getsearchData(){
    this.productService.searchProduct(this.search).then( (ret) => {
      if (ret.success){
        this.inventory = ret.result.sum_Stock;
        this.sum_purchasePrice = ret.result.sum_purchasePrice;
        for (const p of ret.result.products){
          this.products.push(p);
        }
      }
    });
  }
  onBack(){
    this.localStorageService.remove(HUANCHUN_KEY);
  }
}

