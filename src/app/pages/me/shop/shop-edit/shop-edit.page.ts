import { LocalStorageService } from './../../../../shared/services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingService } from '../../setting/setting.service';
import { Shop } from 'src/app/model/shop';

@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.page.html',
  styleUrls: ['./shop-edit.page.scss'],
})
export class ShopEditPage implements OnInit {
  title: string;
  property: string;
  value: string; // 用于ngModel，从shop对象的相关属性中获取数据
  // tslint:disable-next-line: max-line-length
  constructor(private activatedRoute: ActivatedRoute, private settingService: SettingService, private localStorageService: LocalStorageService) {
    activatedRoute.queryParams.subscribe((params) => {
      this.title = params.title;
      this.property = params.property;
    });
  }

  ngOnInit() {
  }

  onSave(shopInfoForm){
    console.log(this.value);
    const user = this.localStorageService.get('user', {});
    const shopList: Shop[] = this.localStorageService.get('ShopList', {});
    if (this.property === 'shopName') {
      user.shopName = this.value;
      shopList[user.id].shopName = this.value;
      alert('修改成功！');
    } else if (this.property === 'shopAbbr') {
      user.shopAbbr = this.value;
      shopList[user.id].shopAbbr = this.value;
      alert('修改成功！');
    } else if (this.property === 'ownerName') {
      user.ownerName = this.value;
      shopList[user.id].ownerName = this.value;
      alert('修改成功！');
    } else if (this.property === 'shopTel') {
      user.shopTel = this.value;
      shopList[user.id].shopTel = this.value;
      alert('修改成功！');
    } else if (this.property === '?') {
      alert('敬请期待！');
    }
    this.localStorageService.set('user', user);
    this.localStorageService.set('ShopList', shopList);
  }
}
