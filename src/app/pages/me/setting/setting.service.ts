import { User } from 'src/app/model/user';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  appConfig: any = {}; // 保存版本号、客服电话、是否登陆
  loginlog: any = {}; // 登陆日志
  user: any = {}; // 保存用户和店铺的信息，和下面那个不是同一个user
  TUser: any = {}; // 用户表
  TAccount: any = {}; // 登录账号表
  TShop: any = {}; // 店铺表
  constructor(private localStorageService: LocalStorageService) { }
  /* user是登陆成功后的用户信息 */
  load(username) {
    this.appConfig = this.localStorageService.get('App', {});
    this.loginlog = this.localStorageService.get('loginLog', {});
    this.TUser = this.localStorageService.get('UserList', {});
    this.TAccount = this.localStorageService.get('AccountList', {});
    this.TShop = this.localStorageService.get('ShopList', {});
    // 构建用户和店铺信息表
    // tslint:disable-next-line: prefer-for-of
    const userInfo = this.TUser[this.loginlog.id];
    const shopInfo = this.TShop[this.loginlog.id];
    this.user = Object.assign(userInfo, shopInfo);
    this.localStorageService.set('user', this.user);
  }
}
