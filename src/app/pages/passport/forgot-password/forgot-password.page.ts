import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { AuthenticationCodeService } from '../shared/authentication-code.service';
import { PassportService } from '../shared/passport.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  phoneOrEmail = ''; // 视图模型的属性账号，双向绑定
  code = ''; // 视图模型的属性密码，双向绑定
  acode = new AuthenticationCodeService();
  // tslint:disable-next-line: max-line-length
  constructor(private menuController: MenuController, private toastController: ToastController, private alertController: AlertController, private passportService: PassportService, private router: Router) {
  }

  ngOnInit() {
  }
  // 点击重置密码时调用
  async onResetPassword(form: NgForm) {
    let toast: any;
    // 判断表单验证是否正确
    if (form.invalid) {
      toast = await this.toastController.create({
        duration: 3000
      });
    }
    if (this.phoneOrEmail === '') {
      toast.message = '请输入您的手机号码或者邮箱';
      toast.present();
    } else if (this.code === '') {
      toast.message = '请输入验证码';
      toast.present();
    } else {
      this.passportService.forgotPassword(this.phoneOrEmail, this.code, this.acode.getCode()).then((result) => {
        if (result.success) {
          // 验证成功，自行完成页面跳转
          this.passportService.set('resetId', this.phoneOrEmail);
          this.router.navigateByUrl('passport/reset-password');
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
  onSendSMS() {
    if (this.phoneOrEmail === '') {
      alert('请输入账号');
      return;
    }
    // 生成验证码
    this.acode.createCode(4);
    const sendSMS = document.getElementById('sendSMS');
    sendSMS.setAttribute('disabled', 'true');
    // 发送短信
    window.alert(this.acode.getCode());
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
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }
}
