import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Category } from 'src/app/model/category';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.page.html',
  styleUrls: ['./category-add.page.scss'],
})
export class CategoryAddPage implements OnInit {
  isSmall = 0;
  id = 0;
  cate: Category;
  children: Array<Category> = [ ];
  constructor(private activatedRoute: ActivatedRoute, private categoryService: CategoryService,
              private alertController: AlertController, private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.isSmall =  Number(queryParams.isSmall) ;
      this.id = Number(queryParams.id);
      console.log('idid:' + this.id);
      if (this.isSmall === 1 ){
        this.cate = this.categoryService.get(this.id);
        this.children.push( {
          id: this.categoryService.new_a_smallid(this.cate.children, this.cate.id),
          name: '',
          children: []
        });
      } else {
        this.cate = {
          id: this.categoryService.new_a_Bigid(),
          name: '',
          children: []
        };
        this.children.push( {
          id: this.categoryService.new_a_smallid(this.children, this.cate.id),
          name: '',
          children: []
        });
      }

    });


  }

  ngOnInit() {

  }


  // 添加小分类
  onAddSubCategory(){
    this.children.push( {
      id: this.categoryService.new_a_smallid(this.children, this.cate.id),
      name: '',
      children: []
    });
  }

  // 保存大小分类
  onSave(){
    console.log('click');
    if (this.isSmall === 0){
      this.cate.children = this.children;
      let result = this.categoryService.insert(this.cate);
      if (result.success){
        this.router.navigateByUrl('product/list');
      }else {
        this.alertController.create({
          header: '警告',
          buttons: ['确定']
        }).then((alert) => {
          alert.message = result.message;
          alert.present();
        });
      }
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.children.length; i++) {
        this.cate.children.push(this.children[i]);
      }
      let result = this.categoryService.update(this.cate);
      if (result.success){
        this.router.navigateByUrl('product/list');
      }else {
        this.alertController.create({
          header: '警告',
          buttons: ['确定']
        }).then((alert) => {
          alert.message = result.message;
          alert.present();
        });
      }
    }
  }
}
