import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Category } from 'src/app/model/category';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {
  categories: Array<Category> = [];
  activeCategory: Category = { id: 0, name: '', children: [] };
  activeSubCategoryes: Array<Category> = [];
  activeSubCategory: Category;
  constructor(private categoryService: CategoryService, private actionSheetController: ActionSheetController,
              private router: Router, private navController: NavController,
              private localStorageService: LocalStorageService, /*private events: Events,*/) {
    // 同步做法
    // let data = this.categoryService.getAll2();
    // this.categories =  data.result;
    // if (this.categories) {
    //   this.activeCategory = this.categories[0];
    //   this.activeSubCategoryes = this.activeCategory.children;
    //   console.log(this.activeSubCategoryes);
    // }
    // 异步出错
    this.categoryService.getAll().then(  (data) => {
      this.categories =  data.result;
      if (this.categories){
        this.activeCategory = this.categories[0];
        this.activeSubCategoryes = this.activeCategory.children;
      }
      // this.activeSubCategoryes = this.activeCategory.children;

    });
  }

  ngOnInit() {
    // window.location.reload();
  }

  // 刷新数据
  daterefresh(){
    this.categoryService.getAll().then(  (data) => {
      this.categories =  data.result;
      if (this.categories){
        this.activeCategory = this.categories[0];
        this.activeSubCategoryes = this.activeCategory.children;
      }
    });
  }
  ionViewDidEnter(){
    this.daterefresh();
  }

  // 选择大分类
  onSelectCategory(id: number) {
    this.activeCategory = this.categories[id - 1];
    this.activeSubCategoryes = this.activeCategory.children;
    console.log('selectid:' + this.activeCategory.id);
  }

  // 弹出操作模态框
  onSelectSubCategory() { }
  async onPresentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '选择您的操作',
      buttons: [
        {
          text: '新增小分类',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.router.navigate(['/product/add'] , {queryParams: {isSmall: 1 , id: this.activeCategory.id }} );
          }
        }, {
          text: '编辑分类',
          handler: () => {// {queryParams: {id: this.activeCategory.id}}
            this.router.navigate(['/product/edit'] , {queryParams: {id: this.activeCategory.id}}  );
            console.log('Archive clicked');
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();

  }

  // 设置item颜色
  getItemColor(id: number) {
    if (id === this.activeCategory.id) {
      return '';
    } else {
      return 'light';
    }
  }

  // 选择小分类，并返回来的页面
  onSelectsmallCategory(cate: Category){
    // 有bug
    let flag = this.localStorageService.get('PRE', -1);
    console.log(flag);
    if ( Number(flag) === -1 ){

    }else if ( Number(flag) === -2 ){
      console.log(cate);
      this.categoryService.setActiveCategory(cate);
      this.router.navigateByUrl('/product/product-add');
    }
    // else if (Number(flag) === -3){
    //   this.categoryService.setActiveCategory(cate);
    //   this.navController.back();
    // }
    else if (Number(flag) === -4){ // 商品管理页
      this.categoryService.setActiveCategory(cate);
      this.navController.back();
    }else {
      this.categoryService.setActiveCategory(cate);
      this.router.navigate( ['/product/Pedit'], {queryParams: {id: Number(flag) }});
    }
  }

  // 返回来的页面
  onback(){
    const flag = this.localStorageService.get('PRE', -1);
    console.log(flag);
    if ( Number(flag) === -1 ){
      this.router.navigateByUrl('/default');
    }else if ( Number(flag) === -2 ){
      this.router.navigateByUrl('/product/Padd');
    }
    else if (Number(flag) === -4){ // 商品管理页
      this.router.navigateByUrl('/product/list')
    }else {
      this.router.navigate( ['/product/Pedit'], {queryParams: {id: Number(flag) }});
    }
  }

}
