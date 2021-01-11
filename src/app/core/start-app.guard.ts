import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginLog } from '../model/login-log';
import { APP_KEY } from '../pages/guide/guide.page';
import { PassportService } from '../pages/passport/shared/passport.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {
  // tslint:disable-next-line: max-line-length
  constructor(private localStorageService: LocalStorageService, private passportService: PassportService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 第一次调用get方法时，'App'这个key不存在，第二个参数会作为默认值返回
    const appConfig: any = this.localStorageService.get(APP_KEY, {
      launched: false,
      version: '200327107',
      mobile: '18965375150'
    });
    if (appConfig.launched === false) { // 如果是第一次启动
      appConfig.launched = true;
      this.localStorageService.set(APP_KEY, appConfig); // 在本地内存中添加
      return true;
    } else {
      if (this.passportService.isLoggedin() === false) {
        this.router.navigateByUrl('passport/login'); // 路由到
      } else {
        const loginlog: LoginLog = this.localStorageService.get('loginLog', []);
        loginlog.loginTime = new Date();
        loginlog.expirationTime = new Date(loginlog.loginTime.getTime() + 5 * 60 * 1000); // 提交作业时改成5分钟
        this.localStorageService.set('loginLog', loginlog); // 更新登陆时间
        this.router.navigateByUrl('home'); // 路由到
      }
      return false;
    }
  }
}
