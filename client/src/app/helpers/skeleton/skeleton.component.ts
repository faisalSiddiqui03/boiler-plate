import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <div #skeleton class="skeleton-warpper"></div>
  `,
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit, AfterViewInit {

  @Input() aspectRatio: number;
  @Input() width = '';
  @Input() height = '';

  @ViewChild('skeleton') el: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    if (this.el.nativeElement) {
      if (this.aspectRatio) {
        const paddingTop = (100 / this.aspectRatio).toFixed(2) + '%';
        this.el.nativeElement.style['padding-top'] = paddingTop;
      }
      if (this.width) {
        this.el.nativeElement.style['width'] = this.width;
      }
      if (this.height) {
        this.el.nativeElement.style['height'] = this.height;
      }
    }
  }


}
