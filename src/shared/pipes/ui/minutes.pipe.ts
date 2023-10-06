import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutes',
  standalone: true,
})
export class MinutesPipe implements PipeTransform {
  transform(value: any): string {
    const parts = String(value).split(':');
    return parts[1] ?? '';
  }
}
