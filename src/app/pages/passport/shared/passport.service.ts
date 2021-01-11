import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';
import { Account } from 'src/app/model/account';
import { AjaxResult } from 'src/app/shared/class/ajax-result';
import { LoginLog } from 'src/app/model/login-log';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Shop } from 'src/app/model/shop';
export const UserList = 'UserList';
@Injectable({
  providedIn: 'root'
})
export class PassportService {
  private storage: any = window.localStorage; // 创建一个名为storage的变量，类型是any，值是window.localStorage
  constructor(private localStorageService: LocalStorageService, private alertController: AlertController, private router: Router) { }
  get(key: string, defaultValue: any): any { // 创建一个名为get的方法，根据key获取数据，如果key不存在返回默认值。
    let value: any = this.storage.getItem(key); // let相当于更完美的var
    try{
      value = JSON.parse(value);
    } catch (error) {
      value = null;
    }
    if (value === null && defaultValue) {
      value = defaultValue;
    }
    return value;
  }
  set(key: string, value: any) { // 添加一个名叫set方法，根据key设置数据。如果key不存在相当于添加操作，如果key存在相当于修改操作。
    this.storage.setItem(key, JSON.stringify(value));
  }
  remove(key: string) { // 添加一个名叫remove方法。
    this.storage.removeItem(key);
  }
  // 注册
  async signup() {}
  // 登录验证
  async login(phoneOrEmail: string, password: string): Promise<AjaxResult> {
    const userList: User[] = this.get(UserList, []);
    const accountList: Account[] = this.get('AccountList', []);
    const shopList: Shop[] = this.get('ShopList', []);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < accountList.length; i++) {
      if (accountList[i].email + '' === phoneOrEmail || accountList[i].phone + '' === phoneOrEmail) {
        if (accountList[i].password === password) {
          const loginlog = new LoginLog();
          loginlog.id = userList[i].id;
          loginlog.email = accountList[i].email;
          loginlog.phone = accountList[i].phone;
          loginlog.shopName = shopList[i].shopName;
          loginlog.loginTime = new Date();
          loginlog.expirationTime = new Date(loginlog.loginTime.getTime() + 432000000);
          this.set('loginLog', loginlog); // 添加登陆信息
          return new AjaxResult(true, null);
        } else {
          return new AjaxResult(false, null, {
            message: '密码错误',
            details: ''
          });
        }
      }
    }
    return new AjaxResult(false, null, {
      message: '账号不存在',
      details: ''
    });
  }
  // 登出
  logout() {
    this.presentAlertConfirm();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
        header: '^_^温馨提示',
        // tslint:disable-next-line: object-literal-shorthand
        message: '确定退出当前账号吗？',
        buttons: [
            {
                text: '取消',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: '确定',
                handler: () => {
                  this.localStorageService.remove('loginLog');
                  this.router.navigateByUrl('passport/login');
                }
            }
        ]
    });
    await alert.present();
}
  // 判断是否已登录
  isLoggedin() {
    const loginlog: LoginLog = this.get('loginLog', {
      shopName: '',
      phone: '',
      email: '',
      loginTime: null,
      expirationTime: null,
    });
    if (loginlog.expirationTime === null) {
      return false;
    }
    if (new Date() > new Date(loginlog.expirationTime)) {
      console.log('out of date');
      return false;
    }
    console.log('in date');
    return true;
  }
  // 忘记密码
  async forgotPassword(phoneOrEmail: string, code: string, acode: string): Promise<AjaxResult> {
    const userList: User[] = this.get(UserList, []);
    const accountList: Account[] = this.get('AccountList', []);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < accountList.length; i++) {
      if (accountList[i].email + '' === phoneOrEmail || accountList[i].phone + '' === phoneOrEmail) {
        if (code === acode) {
          return new AjaxResult(true, null);
        } else {
          return new AjaxResult(false, null, {
            message: '验证码错误',
            details: ''
          });
        }
      }
    }
    return new AjaxResult(false, null, {
      message: '账号不存在',
      details: ''
    });
  }
  // 重置密码
  async resetPassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      return new AjaxResult(false, null, {
        message: '两次密码不一致',
        details: ''
      });
    }
    const phoneOrEmail = this.get('resetId', []);
    this.remove('resetId');
    const accountList: Account[] = this.get('AccountList', []);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < accountList.length; i++) {
      if (accountList[i].email + '' === phoneOrEmail || accountList[i].phone + '' === phoneOrEmail) {
        accountList[i].password = password;
        this.set('AccountList', accountList);
        return new AjaxResult(true, null);
      }
    }
    return new AjaxResult(false, null, {
      message: '未知错误',
      details: ''
    });
  }
}
