import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: any = window.localStorage; // 创建一个名为storage的变量，类型是any，值是window.localStorage
  constructor() { }
  get(key: string, defaultValue: any): any { // 创建一个名为get的方法，根据key获取数据，如果key不存在返回默认值。
    let value: any = this.storage.getItem(key); // let相当于更完美的var
    try{
      value = JSON.parse(value);
    } catch (error) {
      value = null;
    }
    if (value === null && defaultValue) { // 三个等号不仅检查值，还检查类型
      value = defaultValue;
    }
    return value;
  }
  set(key: string, value: any) { // 添加一个名叫set方法，根据key设置数据。如果key不存在相当于添加操作，如果key存在相当于修改操作。
    console.log('set');
    this.storage.setItem(key, JSON.stringify(value));
  }
  remove(key: string) { // 添加一个名叫remove方法。
    this.storage.removeItem(key);
  }
}
