import { Account } from './../../../model/account';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, MenuController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { Signup } from './signup';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthenticationCodeService } from '../shared/authentication-code.service';
import { PassportService } from '../shared/passport.service';
import { Shop } from 'src/app/model/shop';

export const UserList = 'UserList';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  slideIndex = 0;
  code = new AuthenticationCodeService();
  signup: Signup = {
    phone: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
    code: ''
  };
  user: User = {
    id: null,
    phone: '',
    email: '',
    createTime: null
  };
  account: Account = {
    phone: '',
    email: '',
    password: '',
    date: null
  };
  shop: Shop = {
    shopName: '未命名',
    shopAbbr: '未命名',
    ownerName: '',
    shopTel: '未设置'
  };
  @ViewChild('signupSlides', {static: true}) signupSlides: IonSlides;
  // 字符串'signupSlides'和模板中的#signupSlides引用变量的名称一致
  // tslint:disable-next-line: max-line-length
  constructor(private menuController: MenuController, private localStorageService: LocalStorageService, private passportService: PassportService, private router: Router) {} // 在构造函数中依赖注入PassportServiceService

  ngOnInit() {
     this.signupSlides.lockSwipeToNext(true); // 不知道这个干嘛的
  }
  onNext(){
    this.slideIndex++;
    this.signupSlides.lockSwipeToNext(false);
    this.signupSlides.slideNext();
    this.signupSlides.lockSwipeToNext(true);
  }
  onPrevious() {
    this.slideIndex--;
    this.signupSlides.lockSwipeToNext(false);
    this.signupSlides.slidePrev();
    this.signupSlides.lockSwipeToNext(true);
  }
  onRegister() {
    console.log(this.signup);
    // 保存用户信息
    if (this.signup.password === this.signup.confirmPassword) {
      const accountList: Account[] = this.localStorageService.get('AccountList', []);
      const userList: User[] = this.localStorageService.get(UserList, []);
      const shopList: Shop[] = this.localStorageService.get('ShopList', []);
      this.user.id = userList.length;
      this.user.phone = this.signup.phone;
      this.user.email = this.signup.email;
      this.account.password = this.signup.password;
      this.user.createTime = new Date(); // 获取当前系统时间
      for (const data of userList) {
        if (JSON.stringify(data.phone) === JSON.stringify(this.user.phone)) {
          alert('手机号已被注册！');
          return;
        } else if (JSON.stringify(data.email) === JSON.stringify(this.user.email)) {
          alert('邮箱已被注册！');
          return;
        }
      }
      userList.push(this.user);
      this.account.email = this.user.email;
      this.account.phone = this.user.phone;
      accountList.push(this.account);
      this.localStorageService.set('AccountList', accountList); // 在本地内存中添加
      this.localStorageService.set(UserList, userList); // 在本地内存中添加
      // 新增店铺
      this.shop.shopName = this.signup.shopName;
      shopList.push(this.shop);
      this.localStorageService.set('ShopList', shopList);
      this.router.navigateByUrl('passport/login');
    }
  }
  onSubmitPhone(phoneForm) {
  }
  onSubmitEmail(emailForm) {
    if (this.signup.password !== this.signup.confirmPassword) {
      window.alert('两次密码不一致！');
      this.slideIndex--;
      this.signupSlides.slidePrev();
    }
  }
  onSubmitPassword(passwordForm) {
  }
  onSendSMS() {
    // 生成验证码
    this.code.createCode(4);
    const sendSMS = document.getElementById('sendSMS');
    sendSMS.setAttribute('disabled', 'true');
    // 发送短信
    window.alert(this.code.getCode());
    let second = 60;
    // tslint:disable-next-line: only-arrow-functions
    let secondInterval = setInterval(function() {
      if (second < 0) {
        // 关闭定时器
        clearInterval(secondInterval);
        secondInterval = undefined;
        sendSMS.innerHTML = '发送验证码';
        sendSMS.setAttribute('disabled', 'false');
      } else {
        // 继续计时
        sendSMS.innerHTML = '重新发送' + second;
        second--;
      }
    }, 1000); // 每一秒执行定时器
  }
  onValidateCode(codeForm) {
    if (this.code.getCode() !== this.signup.code) {
      this.slideIndex--;
      this.signupSlides.slidePrev();
      window.alert('验证码错误！');
    }
  }
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }
}
