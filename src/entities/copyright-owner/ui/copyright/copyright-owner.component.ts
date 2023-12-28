import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'copyright-owner',
  templateUrl: './copyright-owner.component.html',
  styleUrls: ['./copyright-owner.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CopyrightOwnerComponent {}
