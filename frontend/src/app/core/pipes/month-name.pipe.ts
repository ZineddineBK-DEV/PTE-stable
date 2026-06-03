import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName',
})
export class MonthNamePipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) return '';

    const month = Number(value);
    if (isNaN(month) || month < 1 || month > 12) return 'Invalid month';

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNames[month - 1];
  }
}