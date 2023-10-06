import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours',
  standalone: true,
})
export class HoursPipe implements PipeTransform {
  transform(value: any): string {
    const parts = String(value).split(':');
    return parts[0] ?? '';
  }
}
