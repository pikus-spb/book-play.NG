import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';
import { Links, LinksService } from 'src/entities/links';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.less'],
  imports: [CommonModule, MatListModule, MatExpansionModule],
  standalone: true,
})
export class LinksComponent {
  links: Observable<Links>;

  constructor(service: LinksService) {
    this.links = service.get();
  }
}
