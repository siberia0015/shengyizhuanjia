import { SettingService } from './setting.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PassportService } from '../../passport/shared/passport.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(private passportService: PassportService, private localStorageService: LocalStorageService, private settingService: SettingService) { }

  ngOnInit() {
  }

  logOut() {
    this.passportService.logout();
  }
}
