import { SaleService } from './../../shared/services/sale.service';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public sales: Array<{title: string, content: string, previous: string, current: string}>;
  public funcs: Array<{title: string, url: string, href: string}> = [{
    title: '新增商品',
    url: 'assets/img/add_salse.png',
    href: 'product/product-add'
  }, {
    title: '新增会员',
    url: 'assets/img/add_user.png',
    href: ''
  }, {
    title: '收银记账',
    url: 'assets/img/sales_account.png',
    href: ''
  }, {
    title: '支出管理',
    url: 'assets/img/a_note.png',
    href: ''
  }, {
    title: '商品管理',
    url: 'assets/img/sales_management.png',
    href: 'product/product-list'
  }, {
    title: '会员管理',
    url: 'assets/img/user_management.png',
    href: ''
  }, {
    title: '查询销售',
    url: 'assets/img/shop_management.png',
    href: ''
  }, {
    title: '智能分析',
    url: 'assets/img/analysis.png',
    href: ''
  }, {
    title: '供应商管理',
    url: 'assets/img/gongying_more.png',
    href: ''
  }, {
    title: '挂单',
    url: 'assets/img/guandan_more.png',
    href: ''
  }, {
    title: '高级功能',
    url: 'assets/img/image_addsales.png',
    href: ''
  }];
  constructor(private menuController: MenuController, private saleService: SaleService) { }

  ngOnInit() {
    this.sales = this.saleService.getSales();
  }

  minus(current: number, previous: number): number {
    const result = current - previous;
    if (result > 0) {
      return 1;
    } else if (result === 0) {
      return 0;
    } else {
      return -1;
    }
  }
}
