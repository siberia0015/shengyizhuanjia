import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-base',
  templateUrl: './base.page.html',
  styleUrls: ['./base.page.scss'],
})
export class BasePage implements OnInit {

  constructor(public menuController: MenuController) { }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  // 禁止左划菜单
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  // 开启左划菜单功能
  ionViewDidLeave() {
    this.menuController.enable(true);
  }

}
