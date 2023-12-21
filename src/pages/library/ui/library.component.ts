import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less'],
})
export class LibraryComponent {}
