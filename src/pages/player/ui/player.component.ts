import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BookData } from 'src/entities/fb2';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule],
  standalone: true,
})
export class PlayerComponent implements OnInit {
  book$?: Observable<BookData | null>;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.book$ = this.activatedRoute.data.pipe(map(data => data['book']));
  }
}
