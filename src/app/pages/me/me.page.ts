import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { PassportService } from '../passport/shared/passport.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  public LoginLog = '';
  public selectedIndex = 0;
  public appPages: Array<{title: string, url: string, icon: string}>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private passportService: PassportService
  ) {
    this.initializeApp();
  }
  ngOnInit() {

  }
  initializeApp() {
    this.LoginLog = this.passportService.get('loginLog', {
      email: 'null',
      phone: 'null',
      shopName: '未命名',
      loginTime: null,
      expirationTime: null
    });
    this.appPages = [
      { title: '开店论坛', url: '/home', icon: 'chatbox' },
      { title: '手机橱窗', url: '/home', icon: 'create' },
      { title: '邀请有礼', url: '/home', icon: 'git-merge' },
      { title: '资金账户', url: '/home', icon: 'cash' },
      { title: '反馈建议', url: '/home', icon: 'cash' },
      { title: '帮助中心', url: '/home', icon: 'cash' },
    ];

  }


}
