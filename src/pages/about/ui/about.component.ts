import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less'],
  imports: [MatChipsModule],
  standalone: true,
})
export class AboutComponent {}
