import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router'; // 自动会在文件头部生成导入Router的代码
import { MenuController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

export const APP_KEY = 'App';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.page.html',
  styleUrls: ['./guide.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GuidePage implements OnInit {
  showSkip = true;
  @ViewChild('slides', {static: false}) slides: any; // 对应html文件中的<ion-slides>的#slides属性

  // tslint:disable-next-line: max-line-length
  constructor(private menuController: MenuController, private localStorageService: LocalStorageService, private router: Router) {} // 在构造函数中依赖注入LocalStorageService
  ngOnInit() {
  }
  onSlideWillChange(event) {
    console.log(event);
    this.slides.isEnd().then((end) => {
      this.showSkip = !end;
    });
  }
  onSkip() {
    this.router.navigateByUrl('passport/signup');
  }
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }
}
