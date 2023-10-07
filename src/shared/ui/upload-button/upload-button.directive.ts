import {
  Input,
  Output,
  EventEmitter,
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { fromEvent, Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[uploadButton]',
  standalone: true,
})
export class UploadButtonDirective implements AfterViewInit, OnDestroy {
  @Input() accept?: string;
  @Output() uploadButton = new EventEmitter<FileList>();

  private fileInput: HTMLInputElement | null = null;
  private destroyed$ = new Subject<boolean>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.createFileInput();
    this.attachInputEvent();
  }

  @HostListener('click') onClick() {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }

  private createFileInput(): void {
    this.fileInput = document.createElement('input');
    this.fileInput.setAttribute('type', 'file');
    if (this.accept) {
      this.fileInput.setAttribute('accept', this.accept);
    }
    this.fileInput.setAttribute('hidden', 'true');

    this.el.nativeElement.appendChild(this.fileInput);
  }

  private attachInputEvent(): void {
    if (this.fileInput !== null) {
      fromEvent(this.fileInput, 'change')
        .pipe(
          tap(event => this.fileChanged(event)),
          takeUntil(this.destroyed$)
        )
        .subscribe();
    }
  }

  private fileChanged(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.uploadButton.emit(files);
    } else {
      this.uploadButton.emit();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.el.nativeElement.removeChild(this.fileInput);
    this.fileInput = null;
  }
}
