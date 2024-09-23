import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buttons-calc',
  templateUrl: './buttons-calc.component.html',
  styleUrls: ['./buttons-calc.component.scss']
})
export class ButtonsCalcComponent {
  @Output() buttonClick = new EventEmitter<string>();

  buttons: string[] = [
    '7',
    '8',
    '9',
    '/',
    '4',
    '5',
    '6',
    '*',
    '1',
    '2',
    '3',
    '-',
    '0',
    'C',
    '=',
    '+'
  ];

  buttonClicked(symbol: string) {
    this.buttonClick.emit(symbol);
  }
  isOperator(symbol: string): boolean {
    return ['/', '*', '-', '+', '='].includes(symbol);
  }
}
