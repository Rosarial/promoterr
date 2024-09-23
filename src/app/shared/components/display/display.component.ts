import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements AfterViewInit, OnChanges {
  @Input() expression: string = '';
  @Input() result: string = '';
  constructor() {}
  @ViewChild('resultElement') resultElement!: ElementRef;

  ngAfterViewInit() {
    this.adjustFontSize();
  }

  ngOnChanges() {
    this.adjustFontSize();
  }

  private adjustFontSize() {
    const element = this.resultElement?.nativeElement;
    if (element) {
      const maxFontSize = 2; // em
      const minFontSize = 0.5; // em

      element.style.fontSize = `${maxFontSize}em`;

      while (
        element.scrollWidth > element.clientWidth &&
        parseFloat(element.style.fontSize) > minFontSize
      ) {
        element.style.fontSize = `${parseFloat(element.style.fontSize) - 0.1}em`;
      }
    }
  }
}
