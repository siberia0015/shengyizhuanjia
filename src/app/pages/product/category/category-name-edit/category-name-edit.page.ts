import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-category-name-edit',
  templateUrl: './category-name-edit.page.html',
  styleUrls: ['./category-name-edit.page.scss'],
})
export class CategoryNameEditPage implements OnInit {
  name: string;
  constructor(private modalController: ModalController, private navParams: NavParams) {
    this.name = this.navParams.data.value;
  }

  ngOnInit() {
  }
  dismiss(name?: string) {
    this.modalController.dismiss(name);
  }
  onSave() {
    this.dismiss(this.name);
  }

}
