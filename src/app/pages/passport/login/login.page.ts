import { SettingService } from './../../me/setting/setting.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { PassportService } from '../shared/passport.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username = ''; // 视图模型的属性账号，双向绑定
  password = ''; // 视图模型的属性密码，双向绑定
  // tslint:disable-next-line: max-line-length
  constructor(private settingService: SettingService, private menuController: MenuController, private toastController: ToastController, private alertController: AlertController, private passportService: PassportService, private router: Router) {
  }

  ngOnInit() {
  }
  // 点击登录按钮时调用
  async onLogin(form: NgForm) {
    let toast: any;
    // 判断表单验证是否正确
    if (form.invalid) {
      toast = await this.toastController.create({
        duration: 3000
      });
    }
    if (this.username === '') {
      toast.message = '请输入您的手机号码或者邮箱';
      toast.present();
    } else if (this.password === '') {
      toast.message = '请输入您的密码';
      toast.present();
    } else {
      this.passportService.login(this.username, this.password).then((result) => {
        if (result.success) {
          this.settingService.load(this.username);
          // 验证成功，自行完成页面跳转
          this.router.navigateByUrl('home');
        } else {
          this.alertController.create({
            header: '警告',
            buttons: ['确定']
          }).then((alert) => {
            alert.message = result.error.message;
            alert.present();
          });
        }
      });
    }
  }
  // 点击忘记密码时调用
  onForgotPassword() {
    // 进入找回密码页面
    this.router.navigateByUrl('passport/forgot-password');
  }
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }

}
