import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { SettingService } from '../setting/setting.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  constructor(private settingService: SettingService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
  }
/* 不刷新页面就拿到数据 */
  get user() {
    return this.localStorageService.get('user', {});
  }
}
