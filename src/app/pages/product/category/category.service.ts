import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { ActiveCategory } from 'src/app/shared/active-category';
import { AjaxResult } from 'src/app/shared/class/ajax-result';
import { CATEGORIES } from 'src/app/shared/mock.categories';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
export const CATE_KEY = 'Category';
export const TMPCATE_KEY = 'TMPCategory';
export const PRODUCT_KEY = 'Product';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categorySubject = new Subject<ActiveCategory>();
  constructor(private localStorageService: LocalStorageService) { }

  async getAll(): Promise<AjaxResult> {
    const categories = this.localStorageService.get('Category', CATEGORIES);
    return {
      targetUrl: '',
      result: categories,
      success: true,
      error: null,
      unAuthorizedRequest: false
    };
  }
/**
   * 观察者开始观察
   *
   * @return {*}  {Observable<ActiveCategory>}
   * @memberof CategoryService
   */
  watchCategory(): Observable<ActiveCategory> {
    return this.categorySubject.asObservable();
  }

  /**
   * 向观察者传值
   *
   * @param {ActiveCategory} category
   * @memberof CategoryService
   */
  setActiveCategory(category: ActiveCategory){
    this.categorySubject.next(category);
  }

  /**
   * 创建新的大分类id
   *
   */
  new_a_Bigid(): any {
    const categories = this.localStorageService.get(CATE_KEY, CATEGORIES);
    return categories[categories.length - 1].id + 1;
  }

  /**
   * 创建小分类id
   *
   */
  new_a_smallid(a: Array<Category> , id: number ): any{
    if (a.length === 0) {return id * 100 + 1; }
    else {
      return a[a.length - 1].id + 1;
    }
  }

  /**
   * 判断是否有重复名称的小分类
   *
   * @param {Category[]} a
   * @return {*}  {boolean}
   * @memberof CategoryService
   */
  isUniquesmallName(a: Category[]): boolean {
    for (let i = 0; i < a.length; i++) {
      for (let j = i + 1; j < a.length; j++) {
        if (a[i].name === a[j].name) { return false; }
      }
    }
    return true;
  }

  /**
   * 判断大分类名称是否唯一
   *
   * @param {Category} a
   * @return {*}  {boolean}
   * @memberof CategoryService
   */
  isUniquebigName(a: Category): boolean{
    const categories = this.localStorageService.get(CATE_KEY, CATEGORIES);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < categories.length; i++) {
      if (a.name === String(categories.name)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 新增大分类和及其小分类
   *
   * @param {Category} a
   * @return {*}  {*}
   * @memberof CategoryService
   */
  insert(a: Category): any {

    const categories = this.localStorageService.get(CATE_KEY, CATEGORIES);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < categories.length; i++) {
      if (a.name === String(categories.name)) {
        return {
          success: false,
          message: '大分类名称已存在',
        };
      }
    }
    if (!this.isUniquesmallName(a.children)){
      return {
        success: false,
        message: '小分类名称不能重复'
      };
    }
    categories.push(a);
    this.localStorageService.set(CATE_KEY, categories);
    return {
      success: true,
      message: ''
    };
  }

  /**
   * 根据id获取大分类
   *
   * @param {number} id
   * @return {*}  {Category}
   * @memberof CategoryService
   */
  get(id: number): Category{
    console.log('getid:' + id);
    const categories = this.localStorageService.get(CATE_KEY, CATEGORIES);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < categories.length; i++) {
      if (id === Number(categories[i].id)) {
        return  categories[i]  ;
      }
    }
    return null;
  }

  /**
   * 更新大小分类
   *
   * @param {Category} a
   * @return {*}  {*}
   * @memberof CategoryService
   */
  update(a: Category): any {
    if (!this.isUniquebigName(a)){
      return {
        success: false,
        message: '大分类名称已存在'
      };
    }
    if (!this.isUniquesmallName(a.children)){
      return {
        success: false,
        message: '小分类名称不能重复'
      };
    }
    const categories = this.localStorageService.get(CATE_KEY, CATEGORIES);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < categories.length; i++) {
      if (a.id === Number(categories[i].id)) {
        categories[i] = a;
        this.localStorageService.set(CATE_KEY, categories);
        return {
          success: true,
          message: ''
        };
      }
    }
  }

  /**
   * 判断该分类下是否有商品
   *
   * @param {number} id
   * @param {Product[]} products
   * @return {*}  {boolean}
   * @memberof CategoryService
   */
  isCategoryhasproduct(id: number, products: Product[]): boolean{
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < products.length; i++){
      if (id ===  Number( products[i].categoryId ) ){
        return true;
      }
    }
    return false;
  }

  // 删除大小分类
  deleteCategory(Id: number, flag: number): any{
    console.log('Id=' + Id);
    const products = this.localStorageService.get(PRODUCT_KEY, []);
    const category = this.localStorageService.get(CATE_KEY, CATEGORIES);
    if (flag === 0){ // 删除小分类
      console.log('删除小分类');
      if (this.isCategoryhasproduct(Id, products)){
        return {
          success: false,
          message: '删除的该分类下还有商品记录！'
        };
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < category.length; i++) {
        for (let j = 0; j < category[i].children.length; j++) {
          console.log(category[i].children[j].id);
          if (Id === Number(category[i].children[j].id)) {
            category[i].children.splice(j, 1);
            break;
          }
        }
      }
    } else if (flag === 1) { // 删除大分类
      console.log('删除大分类');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < category.length; i++){
        if (Id === Number(category[i].id)) {
          if (this.isCategoryhasproduct(Id, products)){
            return {
              success: false,
              message: '删除的该分类下还有商品记录！'
            };
          }
          // tslint:disable-next-line: prefer-for-of
          for (let j = 0; j < category[i].children.length; j++) {
            if (this.isCategoryhasproduct(category[i].children[j].id, products)){
              return {
                success: false,
                message: '删除的该分类下的小分类还有商品记录！'
              };
            }
          }
          category.splice(i, 1);
          break;
        }
      }
    }
    this.localStorageService.set(CATE_KEY, category);
    return {
      success: true,
      message: ''
    };
  }
}
