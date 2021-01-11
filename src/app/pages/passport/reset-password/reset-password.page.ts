import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController, AlertController } from '@ionic/angular';
import { PassportService } from '../shared/passport.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  password = '';
  confirmPassword = '';
  // tslint:disable-next-line: max-line-length
  constructor(private menuController: MenuController, private toastController: ToastController, private alertController: AlertController, private passportService: PassportService, private router: Router) {
  }
  ngOnInit() {
  }
  resetPassword() {
    this.passportService.resetPassword(this.password, this.confirmPassword).then((result) => {
      if (result.success) {
        // 验证成功，自行完成页面跳转
        alert('密码修改成功！');
        this.router.navigateByUrl('passport/login');
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
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }

}
