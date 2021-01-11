import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, MenuController, AlertController } from '@ionic/angular';
import { Product } from 'src/app/model/product';
import { BasePage } from '../../base/base.page';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-storage',
  templateUrl: './product-storage.page.html',
  styleUrls: ['./product-storage.page.scss'],
})
export class ProductStoragePage extends BasePage implements OnInit {
  @ViewChild('signupSlides', {static: true}) signupSlides: IonSlides;
  ru = true;
  id = 0;
  p: Product;
  num_ru: number;
  num_chu: number;
  constructor(public menuController: MenuController, private activatedRoute: ActivatedRoute,
              private productService: ProductService, private alertController: AlertController,
              private router: Router) {
    super(menuController);
    activatedRoute.queryParams.subscribe( (queryParams) => {
      this.id = queryParams.id;
      this.p = productService.getProductFromId(this.id);
      if ( this.p.inventory === null){
        this.p.inventory = 0;
      }
      console.log(this.p);
    });
  }

  ngOnInit() {
    this.signupSlides.lockSwipeToNext(true);
    this.signupSlides.lockSwipeToPrev(true);
  }

  // 商品出库
  onChuku(){
    if (this.ru){
      this.ru = false;
      this.signupSlides.lockSwipeToNext(false);
      this.signupSlides.slideNext();
      this.signupSlides.lockSwipeToNext(true);
    }
  }

  // 商品入库
  onRuku(){
    if (!this.ru){
      this.ru = true;
      this.signupSlides.lockSwipeToPrev(false);
      this.signupSlides.slidePrev();
      this.signupSlides.lockSwipeToPrev(true);
    }
  }
  init(){
    this.num_chu = null;
    this.num_ru = null;
  }

  // 确认出库以及是否库存充足
  async onQueRenChuKu(){
    console.log(this.num_chu);
    if (this.num_chu <= this.p.inventory){
      this.p.inventory -= this.num_chu;
      this.productService.setProductFromId(this.id, this.p);
      this.tishichenggong('成功出库！！！');
      this.init();
      this.router.navigate(['/product/product-detail'], {queryParams: {id: this.id }} );
    } else {
      const twoalert = await this.alertController.create({
        header: '错误！',
        message: '库存不足',
        buttons: [{
          text: '确定',
          cssClass: 'secondary',
        }]
      });
      await twoalert.present();
    }
  }

  // 商品出库
  onQueRenRuku(){
    console.log(this.num_ru);
    this.p.inventory += this.num_ru;
    this.productService.setProductFromId(this.id, this.p);
    this.tishichenggong('成功入库！！！');
    this.init();
    this.router.navigate(['/product/product-detail'], {queryParams: {id: this.id }} );
  }

  // 显示成功框
  async tishichenggong(message: string){
    const alert = await this.alertController.create({
      header: message,
    });
    await alert.present();
    // tslint:disable-next-line: whitespace
    setTimeout(() => {
      alert.dismiss();
    }  , 500 );
  }
}
