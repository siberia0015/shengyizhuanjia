import { Injectable } from '@angular/core';
import { Product } from 'src/app/model/product';
import { AjaxResult } from 'src/app/shared/class/ajax-result';
import { ProductResultRequest } from 'src/app/shared/product-result-request';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
const PRODUCT_KEY = 'ProductList';
const TMPPRODUCT_KEY = 'TmpProduct';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private localStorageService: LocalStorageService) {

  }

  /**
   * 插入商品
   * 
   * @param {Product} input
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
  async insert(input: Product): Promise<AjaxResult> {
    let products = this.localStorageService.get(PRODUCT_KEY, []);
    input.id = this.autoIncrement(products) ; // 未使用UUID
    products.push(input);
    this.localStorageService.set(PRODUCT_KEY, products);
    return {
      success: true,
      result: 0,
    };
  }

  /**
   * 自动生成商品id
   *
   * @param {Product[]} array
   * @return {*}  {number}
   * @memberof ProductService
   */
  autoIncrement(array: Product[]): number {
    const products = this.localStorageService.get(PRODUCT_KEY, []);
    if (products.length === 0){
      return 1;
    }else {
      return products[products.length - 1].id + 1;
    }
  }

  /**
   * 缓存当前填写的商品信息
   *
   */
  setTmpProduct(a: Product){
    this.localStorageService.set(TMPPRODUCT_KEY, a);
  }
  getTmpProduct(): Product{
    let a = this.localStorageService.get(TMPPRODUCT_KEY, null);
    this.localStorageService.remove(TMPPRODUCT_KEY);
    return a;
  }

  /**
   * 获取商品分页的商品数据
   *
   * @param {ProductResultRequest} a
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
  async getList(a: ProductResultRequest): Promise<AjaxResult> {
    let index = a.skipCount;
    let size = a.maxResultCount;
    if (index < 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('分页的索引应大于等于零');
    }
    if (size <= 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('每页显示的记录数应大于零');
    }
    // 其他代码省略
    let ret: any[];
    let products = this.localStorageService.get(PRODUCT_KEY, []);
    ret = products.slice(index, Math.min( index + size, products.length ) );
    return {
      success: true,
      result: {
        totalCount: ret.length,
        products: ret
      }
    };
  }

  /**
   * 通过商品分类搜索商品数据
   *
   * @param {ProductResultRequest} a
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
  async getListByCategoryId(a: ProductResultRequest): Promise<AjaxResult> {
    let index = a.skipCount;
    let size = a.maxResultCount;
    let categoryId = a.searchCategoryId;
    let PofC = [];
    let products = this.localStorageService.get(PRODUCT_KEY, []);
    for ( const p of products) {
      if (p.categoryId === categoryId){
        PofC.push(p);
      }
    }
    let ret = PofC.slice(index , Math.min( index + size, PofC.length ) );
    return {
      success: true,
      result: {
        totalCount: ret.length,
        products: ret
      }
    };
  }

  /**
   * 根据商品分类获取商品列表
   *
   * @param {boolean} [byCategory]
   * @param {number} [categoryId]
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
  async getProductStatistics(byCategory?: boolean, categoryId?: number ): Promise<AjaxResult> {
    let products = this.localStorageService.get(PRODUCT_KEY, []);
    if (byCategory){
      let PofC = [];
      for ( const p of products) {
        if (p.categoryId === categoryId){
          PofC.push(p);
        }
      }
      products = PofC;
    }
    let sum_Stock = 0;
    let sum_purchasePrice = 0;
    for (const p of products){
      if (p.inventory !== null){
        sum_Stock += p.inventory;
        if (p.purchasePrice !== null){
          sum_purchasePrice += p.inventory * p.purchasePrice;
        }
      }
    }
    return {
      success: true,
      result: {
        sum_Stock,
        sum_purchasePrice
      }
    };
  }

  /**
   * 通过商品分类以及商品名称及条形码搜索商品数据
   *
   * @param {ProductResultRequest} a
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
  async searchProduct(a: ProductResultRequest): Promise<AjaxResult>{
    let products = this.localStorageService.get(PRODUCT_KEY, []);
    let tmp = [];
    if (a.searchCategoryId){
      for (const p of products){
        if(p.categoryId === a.searchCategoryId){
          tmp.push(p);
        }
      }
      products = tmp;
    }
    tmp = [];
    let sum_Stock = 0;
    let sum_purchasePrice = 0;
    for (const p of products){
      if ( p.name.indexOf(a.searchText) !== -1 || p.barcode === a.searchText ){
        tmp.push(p);
        if (p.inventory !== null){
          sum_Stock += p.inventory;
          if (p.purchasePrice !== null){
            sum_purchasePrice += p.inventory * p.purchasePrice;
          }
        }
      }
    }
    const ret = tmp.slice( a.skipCount, Math.min(tmp.length, a.skipCount + a.maxResultCount) );
    return {
      success: true,
      result: {
        products: ret,
        sum_Stock,
        sum_purchasePrice,
      }
    };
  }

  /**
   * 根据商品id获取商品数据
   *
   * @param {number} id
   * @return {*}  {Product}
   * @memberof ProductService
   */
  getProductFromId(id: number): Product{
    let products = this.localStorageService.get(PRODUCT_KEY,[]);
    for ( let p of products){
      if ( Number( p.id) === Number(id) ){
        console.log('getproduct');
        return p;
      }
    }
    console.log('wrong');
    return null;
  }

  /**
   * 根据商品id删除商品数据
   *
   * @param {number} id
   * @memberof ProductService
   */
  deleteProductFromId(id: number) {
    let products = this.localStorageService.get(PRODUCT_KEY, []);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < products.length; i++){
      if ( Number( products[i].id) === Number(id) ){
        products.splice(i, 1);
        break;
      }
    }
    this.localStorageService.set(PRODUCT_KEY, products);
  }

  /**
   * 根据id更新商品数据
   *
   * @param {number} id
   * @param {Product} p
   * @memberof ProductService
   */
  setProductFromId(id: number, p: Product){
    let products = this.localStorageService.get(PRODUCT_KEY, []);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < products.length; i++){
      if ( Number( products[i].id) === Number(id) ){
        products[i] = p;
        break;
      }
    }
    this.localStorageService.set(PRODUCT_KEY, products);
  }
}