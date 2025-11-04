
import { Component, inject, Input, OnInit } from '@angular/core';
import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


export function arabicOnlyValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null; // لو فاضي سيبه للـ required

  // يقبل فقط الحروف العربية + مسافات
  const arabicRegex = /^[\u0600-\u06FF\s]+$/;

  return arabicRegex.test(value) ? null : { arabicOnly: 'مسموح فقط بالحروف العربية' };
}

export function englishOnlyValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null; // لو فاضي سيبه للـ required

  // يقبل فقط الحروف الإنجليزية + مسافات
  const englishRegex = /^[A-Za-z\s]+$/;

  return englishRegex.test(value) ? null : { englishOnly: 'Only English letters are allowed' };
}



export const timeRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const startControl = group.get('startTime');
  const endControl = group.get('endTime');

  if (!startControl || !endControl) return null;

  const start = startControl.value;
  const end = endControl.value;

  if (!start || !end) {
    // clear error if one is missing
    endControl.setErrors(null);
    return null;
  }

  const toSeconds = (t: string): number => {
    const [hh, mm, ss] = t.split(':').map(Number);
    return hh * 3600 + mm * 60 + (ss || 0);
  };

  if (toSeconds(end) <= toSeconds(start)) {
    endControl.setErrors({ timeRangeInvalid: 'End time must be greater than start time' });
    return { timeRangeInvalid: true };
  } else {
    // ✅ clear only this error without touching other errors (like required)
    if (endControl.hasError('timeRangeInvalid')) {
      const errors = { ...endControl.errors };
      delete errors['timeRangeInvalid'];
      endControl.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }
};



@Component({
  selector: 'app-validation-error',
  imports: [NgIf, NgFor, TranslateModule],
  templateUrl: './validation-error.html',
  styleUrl: './validation-error.scss'
})
export class ValidationError implements OnInit {

  translate = inject(TranslateService)
  ngOnInit(): void {
    this.control = this.form.get(this.controlName);
  }




  @Input({ required: true }) form!: AbstractControl;
  @Input({ required: true }) controlName!: string;

  control!: AbstractControl | null;



  errorMessages(): string[] {
    if (!this.control || !this.control.errors) return [];
    const errors: ValidationErrors = this.control.errors;
    const msgs: string[] = [];

    for (const key in errors) {
      switch (key) {
        case 'required':
          msgs.push(this.translate.instant('MESSAGES.REQUIRED_FIELD'));
          break;
        case 'email':
          msgs.push(this.translate.instant('VALIDATION.EMAIL_INVALID'));
          break;
        case 'min':
          msgs.push(
            this.translate.instant('VALIDATION.MIN_VALUE', { min: errors['min'].min })
          );
          break;
        case 'minlength':
          msgs.push(
            this.translate.instant('VALIDATION.MIN_LENGTH', { min: errors['minlength'].requiredLength })
          );
          break;
        case 'maxlength':
          msgs.push(
            this.translate.instant('VALIDATION.MAX_LENGTH', { max: errors['maxlength'].requiredLength })
          );
          break;
        case 'arabicOnly':
          msgs.push(this.translate.instant('VALIDATION.ARABIC_ONLY'));
          break;
        case 'englishOnly':
          msgs.push(this.translate.instant('VALIDATION.ENGLISH_ONLY'));
          break;
        case 'pattern':
          msgs.push(this.translate.instant('VALIDATION.PHONE_INVALID'));
          break;

        default:
          msgs.push(this.translate.instant('MESSAGES.ERROR'));
      }
    }

    return msgs;
  }



}

