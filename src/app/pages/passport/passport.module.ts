import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PassportRoutingModule } from './passport-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignupPage } from './signup/signup.page';
import { LoginPage } from './login/login.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';


@NgModule({
  declarations: [
    SignupPage,
    LoginPage,
    ForgotPasswordPage,
    ResetPasswordPage,
  ],
  imports: [
    SharedModule,
    CommonModule,
    PassportRoutingModule,
  ]
})
export class PassportModule { }
