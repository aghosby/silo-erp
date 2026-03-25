import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDate'
})
export class LocaleDatePipe implements PipeTransform {

    transform(value: any, format: string = 'dd/MM/yyyy'): string {
        if (!value) return '';

        let date: Date | null = null;

        // ISO format
        if (typeof value === 'string' && value.includes('T')) {
            date = new Date(value);
        }

        // DD-MM-YYYY
        else if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
            const [day, month, year] = value.split('-').map(Number);
            date = new Date(year, month - 1, day);
        }

        // Timestamp
        else if (!isNaN(Number(value))) {
            date = new Date(Number(value));
        }

        // Already a Date
        else if (value instanceof Date) {
            date = value;
        }

        if (!date || isNaN(date.getTime())) return '';

        return this.formatDate(date, format);
    }

    private formatDate(date: Date, format: string): string {
        const day = date.getDate();
        const day2 = day.toString().padStart(2, '0');

        const month = date.getMonth() + 1;
        const month2 = month.toString().padStart(2, '0');

        const year = date.getFullYear();

        const monthShort = date.toLocaleString('en-US', { month: 'short' });

        return format
        .replace('dd', day2)
        .replace('d', day.toString())
        .replace('MMM', monthShort)
        .replace('MM', month2)
        .replace('yyyy', year.toString())
        .replace('y', year.toString());
    }
}
