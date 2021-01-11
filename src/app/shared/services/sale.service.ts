import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private storage: any = window.localStorage;
  titles = ['今日', '七日', '本月'];
  content = ['比昨日', '比同期', '比同期'];
  constructor() { }
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
  // 随机生成6个数字，分别表示昨天、今天、7天、去年同期7天、本月和去年同期月份的销售数据
  getSales() {
    // tslint:disable-next-line: prefer-const
    let Sales: Array<{title: string, content: string, previous: string, current: string}> = new Array();
    for (let i = 0; i < 3; i++) {
      const sales = {title: '', content: '', previous: '', current: ''};
      sales.title = this.titles[i];
      sales.content = this.content[i];
      sales.current = this.getRandomNumInt(0, 10000) + '';
      sales.previous = this.getRandomNumInt(0, 10000) + '';
      Sales.push(sales);
    }
    return Sales;
  }

  getRandomNumInt(min: number, max: number) {
    const Range = max - min;
    const Rand = Math.random(); // 获取[0-1）的随机数
    return (min + Math.round(Rand * Range)); // 放大取整
  }
}
