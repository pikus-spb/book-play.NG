import { Component } from '@angular/core';
import { CardsComponent } from 'src/widgets/cards';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  imports: [CardsComponent],
  standalone: true,
})
export class HomeComponent {}
