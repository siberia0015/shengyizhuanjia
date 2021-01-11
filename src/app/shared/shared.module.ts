import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocalStorageService } from './services/local-storage.service';
import { CopyrightComponent } from './components/copyright/copyright.component';
import { ConfirmDirective } from './directives/confirm.directive';
import { PatternDirective } from './directives/pattern.directive';



@NgModule({
  declarations: [
    CopyrightComponent,
    ConfirmDirective,
    PatternDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CopyrightComponent,
    ConfirmDirective,
  ],
  providers: [
    LocalStorageService,
    // PassportServiceService,
    // SaleService,
  ]
})
export class SharedModule { }
