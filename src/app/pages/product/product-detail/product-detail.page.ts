import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, PopoverController } from '@ionic/angular';
import { Product } from 'src/app/model/product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  id: number;
  p: Product;
  showpurchasePrice = false;
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService,
              private actionSheetController: ActionSheetController, private alertController: AlertController,
              private router: Router, public popoverController: PopoverController) {
    activatedRoute.queryParams.subscribe( (queryParams) => {
      this.id = queryParams.id;
      this.p = productService.getProductFromId(this.id);
      console.log(this.p);
    });
  }

  ngOnInit() {
  }

  // 显示商品进价
  showPurchasePrice(){
    this.showpurchasePrice = true;
  }
  // 选择编辑或删除
  async onChangeorDelete(){
    const actionSheet = await this.actionSheetController.create({
      header: '选择您的操作',
      buttons: [
        {
          text: '修改商品',
          role: 'destructive',
          handler: () => {
            console.log('Change clicked');
            this.router.navigate(['/product/product-edit'], { queryParams: {id: this.id}  } );
          }
        }, {
          text: '删除商品',
          handler: () => {
            console.log('Delete clicked');
            this.IfWanttoDelete();
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

  // 弹出确认删除框
  async IfWanttoDelete(){
    let flag = false;
    const alert = await this.alertController.create({
      header: '你确认要删除吗!',
      message: '请谨慎删除商品信息',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: '确认',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            flag = true;
            this.showDeleteSuccess();
            this.deleteProduct();
            this.router.navigateByUrl('/product/product-list');
          }
        },
      ]
    });
    await alert.present();
  }

  // 成功删除提示
  showDeleteSuccess(){
    setTimeout(async () => {
      console.log('dsadsa');
      const twoalert = await this.alertController.create({
        header: '删除成功！！',
      });
      await twoalert.present();
      setTimeout(() => {
        twoalert.dismiss();
      }  , 500 );
    }, 500);

  }
  deleteProduct(){
    this.productService.deleteProductFromId(this.id);
  }

  // 弹出分享模态框
  async onShare(){
    const actionSheet = await this.actionSheetController.create({
      header: '您要分享到？',
      buttons: [
        {
          text: '微信好友',
          //role: 'destructive',
          handler: () => {
            console.log('Change clicked');
          }
        }, {
          text: '朋友圈',
          handler: () => {
          }
        }, {
          text: '短信',
          handler: () => {
          }
        }, {
          text: 'QQ',
          handler: () => {
          }
        },{
          text: '取消',
          role: 'cancel',
        }
      ]
    });
    await actionSheet.present();
  }

}

