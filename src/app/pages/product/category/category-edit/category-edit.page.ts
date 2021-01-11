import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';
import { Category } from 'src/app/model/category';
import { CategoryNameEditPage } from '../category-name-edit/category-name-edit.page';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.page.html',
  styleUrls: ['./category-edit.page.scss'],
})
export class CategoryEditPage implements OnInit {
  @ViewChild('BigitemSliding', {static: true}) BigitemSliding: IonItemSliding;
  @ViewChild('SmallitemSliding', {static: true}) SmallitemSliding: IonItemSliding;

  id = 0;
  category: Category;
  constructor(private activatedRoute: ActivatedRoute, private categoryService: CategoryService,
              private modalController: ModalController, private alertController: AlertController,
              private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.id = Number(queryParams.id);
      console.log('idid:' + this.id);
      this.category = this.categoryService.get(this.id);
    });
  }

  ngOnInit() {
  }

  refresh(){
    this.category = this.categoryService.get(this.id);
  }

  // 弹出名字编辑界面
  private async presentModal(name: string) {
    const modal = await this.modalController.create({
      component: CategoryNameEditPage,
      componentProps: { value: name }
    });
    await modal.present();
    return modal.onWillDismiss();
  }

  // 编辑商品名
  async onEditCategoryName(item: IonItemSliding) {
    item.close();
    const {data} = await this.presentModal(this.category.name);
    if (data) {
      this.category.name = String(data);
      this.categoryService.update(this.category);
    }else {
    }
  }

  // 提示删除错误
  async deleteerror(result: any){
    if (result.success === false) {
      setTimeout(async () => {
        const twoalert = await this.alertController.create({
          header: '错误！',
          message: result.message,
          buttons: [{
            text: '确定',
            cssClass: 'secondary',
          }]
        });
        await twoalert.present();
      }, 800);
    }
  }

  // 编辑小分类名
  async onEditSubCategoryName(item: IonItemSliding, subCategory: Category) {
    item.close();
    const {data} = await this.presentModal(subCategory.name);
    if (data) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.category.children.length; i++) {
        if ( Number( subCategory.id) === this.category.children[i].id) {
          this.category.children[i].name = String(data);
          break;
        }
      }
      this.categoryService.update(this.category);
    }else {
      console.log('cancel');
    }
  }

  // 实现删除功能
  async onDelete(item: IonItemSliding, Id?: number) {
    console.log(Id);
    item.close();
    let result = {
      success: false,
      message: '500'
    };
    // let iscontinue = null;
    const alert = await this.alertController.create({
      header: '你确认要删除吗!',
      message: '将会删除该类别下的所有商品记录',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: '确认',
          handler:  () => {
            console.log('Confirm Okay');
            if (Id > 10){ // 删除小分类
              result = this.categoryService.deleteCategory(Id, 0);
              if (result.success){
                this.router.navigateByUrl('product/list');
              }else {
                console.log('错误');
              }
            } else { // 删除大分类
              result = this.categoryService.deleteCategory(Id, 1);
              if (result.success){
                this.router.navigateByUrl('product/list');
              }else {
                console.log('错误');
              }
            }
            this.refresh();
            this.deleteerror(result);
          }
        }
      ]
    });
    await alert.present();
  }
}
