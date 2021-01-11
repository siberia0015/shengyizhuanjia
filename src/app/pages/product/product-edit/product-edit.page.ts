import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {
  id: number;
  p: Product;
  newcateid: number;
  newcatename: string;
  subscription: Subscription;
  flag = false;
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService,
              private actionSheetController: ActionSheetController,
              private imagePicker: ImagePicker, private barcodeScanner: BarcodeScanner,
              private router: Router, private categoryService: CategoryService,
              private alertController: AlertController, private localStorageService: LocalStorageService,
              ) {

    activatedRoute.queryParams.subscribe((queryParams) => {
      this.id = queryParams.id;
      this.p = productService.getProductFromId(this.id);
      this.subscription = categoryService.watchCategory().subscribe(
        (activeCategory) => {
          this.newcateid = activeCategory.id;
          this.newcatename = activeCategory.name;
          this.flag = true;
        },
        (error) => {
        }
      );
    });

  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    if (this.flag){
      this.p.categoryId = this.newcateid;
      this.p.categoryName = this.newcatename;
      this.localStorageService.set('PRE',  this.id );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // 扫描得到条形码
  onScan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.p.barcode = barcodeData.text;
     }).catch(err => {
         console.log('Error', err);
     });
  }

  // 保存商品信息
  onSave(){
    this.productService.setProductFromId(this.id, this.p);
    this.router.navigate(['/product/product-detail'],  { queryParams: {id: this.id}  });
  }
}
