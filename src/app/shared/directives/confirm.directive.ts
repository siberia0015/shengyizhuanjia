import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

/*export function confirmValidator(confirm: string): ValidatorFn { // confirm要比对的字符串
  return (control: AbstractControl): ValidationErrors | null => { // 传入绑定表单的formControl
    if ( !control.value ) { // 如果绑定未输入值，则返回 required错误
     return {required: true };
    }
  　// 如果两次输入的值不相同，则返回confirm的错误
    return control.value !== confirm ? {confirm: {value: true}} : null; // 返回null 验证通过
   };
}*/

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[yxyConfirm]',
  // 用验证器一定要加，自定方法不用
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmDirective,
      multi: true
    }
  ]
})
export class ConfirmDirective implements Validator{
  @Input('yxyConfirm') confirm: string;
  constructor() { }
  validate(control: AbstractControl): ValidationErrors {
    // throw new Error('Method not implemented.');
    return this.confirm ? confirmValidator(this.confirm)(control) : null;
  }
  /*registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }*/
}
export function confirmValidator(confirm: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => { // 传入绑定表单的formControl
    if ( !control.value ) { // 如果绑定未输入值，则返回 required错误
     return {required: true };
    }
  　// 如果两次输入的值不相同，则返回confirm的错误
    return control.value !== confirm ? {confirm: {value: true}} : null;
   };
}
