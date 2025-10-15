import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  log(message: string) {
    console.log(`[UtilService]: ${message}`);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}