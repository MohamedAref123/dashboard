import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'claimTranslate',
  standalone: true
})
export class ClaimTranslatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // تحويل أي نص لاتيني إلى key مناسب للترجمة
    let key = value.toUpperCase().replace(/\s+/g, '.');

    if (!key.startsWith('CLAIMS.')) key = 'CLAIMS.' + key;

    return key;
  }
}
