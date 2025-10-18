import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateHelper {
  combineDateAndTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);

    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);

    // Format to dd-MM-yyyy HH:mm
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(combined.getDate());
    const month = pad(combined.getMonth() + 1);
    const year = combined.getFullYear();
    const hour = pad(combined.getHours());
    const minute = pad(combined.getMinutes());

    return `${day}-${month}-${year} ${hour}:${minute}`;
  }

  formatDateString(dateString: string, format: string, locale: string = 'en-US'): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return formatDate(date, format, locale);
    } catch {
      return '';
    }
  }

  formattimeString(timeString: string, format: string, locale: string = 'en-US'): string {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return '';
      return formatDate(date, format, locale);
    } catch {
      return '';
    }
  }
}
