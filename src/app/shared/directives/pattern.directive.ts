import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[yxyPattern]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PatternDirective,
      multi: true
    }
  ]
})
export class PatternDirective implements Validator {
  @Input('yxyPattern') pattern: string;
  constructor() { }
  validate(control: AbstractControl): ValidationErrors {
    return PatternValidator()(control);
  }
}
export function PatternValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => { // 传入绑定表单的formControl
    if ( !control.value ) { // 如果绑定未输入值，则返回 required错误
     return {required: true };
    }
  　// 如果输入格式有误，返回pattern错误
    const pattern = /^(1[3-9]\d{9})$/;
    return !pattern.test(control.value) ?  {pattern: true} : null;
   };
}

