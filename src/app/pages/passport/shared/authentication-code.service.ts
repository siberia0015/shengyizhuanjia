import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCodeService {
  // 用于保存验证码
  private code: string;
  // 存放验证码的过期时间
  private deadline: number;
  constructor() {
    this.code = '';
  }
  // 获取验证码
  getCode() {
    return this.code;
  }
  // 获取过期时间
  getDeadline() {
    return this.deadline;
  }
  // 生成指定长度的随机数字
  createCode(count: number): string{
    this.code = '';
    // 10分钟内有效
    this.deadline = Date.now() + 60 * 10 * 1000;
    for (let i = 0; i < count; i++) {
      this.code = this.code.concat(this.getRandomNumInt(0, 9).toString());
    }
    return this.code;
  }
  // 验证用户输入的短信验证码是否一致，是否过期
  validate(value: string): boolean{
    const now = Date.now();
    return value === this.code && now < this.deadline;
  }
  getRandomNumInt(min: number, max: number) {
    const Range = max - min;
    const Rand = Math.random(); // 获取[0-1）的随机数
    return (min + Math.round(Rand * Range)); // 放大取整
  }
}
