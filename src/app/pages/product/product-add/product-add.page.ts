import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit, OnDestroy {
  product: Product;
  subscription: Subscription;


  constructor(private actionSheetController: ActionSheetController, private productService: ProductService,
              private router: Router, private categoryService: CategoryService, private statusBar: StatusBar, 
              private alertController: AlertController, private localStorageService: LocalStorageService, private barcodeScanner: BarcodeScanner,
              private imagePicker: ImagePicker, private camera: Camera
              ) {/* */
                //沉浸式并且悬浮透明
    this.statusBar.overlaysWebView(true);
    const preP =  productService.getTmpProduct();
    // const selectedC = categoryService.getTmpCategory();
    if (preP === null ){
      this.initProduct();
    }else {
      this.product = preP;
      // this.product.categoryId = selectedC.id;
      // this.product.categoryName = selectedC.name;
    }
    this.subscription = categoryService.watchCategory().subscribe(
      (activeCategory) => {
        this.product.categoryId = activeCategory.id;
        this.product.categoryName = activeCategory.name;
      },
      (error) => {
      }
    );
    this.localStorageService.set('PRE',  Number(-2) );
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    //this.daterefresh();
  }
  daterefresh(){
    const preP = this.productService.getTmpProduct();
    // const selectedC = this.categoryService.getTmpCategory();
    if (preP === null ){
      this.initProduct();
    }else {
      this.product = preP;
      // this.product.categoryId = selectedC.id;
      // this.product.categoryName = selectedC.name;
    }
    this.subscription = this.categoryService.watchCategory().subscribe(
      (activeCategory) => {
        this.product.categoryId = activeCategory.id;
        this.product.categoryName = activeCategory.name;
      },
      (error) => {
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initProduct(): void {
    this.product = {
      id: null,
      name: '',
      categoryId: 5,
      categoryName: '默认分类',
      category: '',
      barcode: '',
      images: [],
      price: null,
      purchasePrice: null,
      inventory: null,
      standard: null,
      remarks: '',
    };
  }
// 提示成功保存
  async tishichenggong(){
    const alert = await this.alertController.create({
      header: '成功保存！！！',
    });
    await alert.present();
    // tslint:disable-next-line: whitespace
    setTimeout(() => {
      alert.dismiss();
    }  , 500 );
  }
// 保存成功，返回商品管理页
  onSave(iscontinue: boolean){
    this.productService.insert(this.product).then(result => {
      if (result.success){
        this.tishichenggong();
        console.log('Success!');
        if (iscontinue){
          this.daterefresh();
        }else {
          this.router.navigateByUrl('product/product-list');
        }
      }
    });

  }


  // 从拍照获取图片
  getImageFromPaiZhao(){
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then(async (imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.product.images.push(base64Image);
     }, (err) => {
      // Handle error
     });
  }

  // 从相册获取图片

  getImageFromXiangce(){
    const options: ImagePickerOptions = {
      maximumImagesCount: 3,
      outputType: 1,
      quality: 10
    };
    this.imagePicker.getPictures(options).then(async (results) => {
      if (results.length + this.product.images.length > 3){
        const alert = await this.alertController.create({
          header: '商品照片数量不能超过三张!',
          message: '您只能再选择' + String( 3 - this.product.images.length ) + '张照片',
          buttons: [
            {
              text: '确定',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            },
          ]
        });
        await alert.present();
      } else {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < results.length; i++) {
          this.product.images.push('data:image/jpeg;base64,' + results[i]);
          console.log('Image URI: ' + results[i]);
        }
      }
    }, (err) => { });
  }

  // 弹出获取图片的模态框
  async onPresentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '选择您的操作',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          handler: () => {
            console.log(' Paizhao clicked');
            this.getImageFromPaiZhao();
          }
        }, {
          text: '相册',
          handler: () => {
            console.log('Xiangce clicked');
            this.getImageFromXiangce();
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


  // 扫描获取条形码
  onScan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.product.barcode = barcodeData.text;
     }).catch(err => {
         console.log('Error', err);
     });
  }

  gettheCategy(){
    this.productService.setTmpProduct(this.product);
    this.router.navigateByUrl('product/list');
  }

}
