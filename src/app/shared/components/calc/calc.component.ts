import { Component } from '@angular/core';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss']
})
export class CalcComponent {
  currentValue: string = '0';
  expression: string = '';
  private operator: string = '';
  private operand1: number | null = null;
  private operand2: number | null = null;

  onButtonClick(symbol: any) {
    if (!isNaN(Number(symbol))) {
      this.currentValue = this.currentValue === '0' ? symbol : this.currentValue + symbol;
      this.expression += symbol;
    } else if (symbol === 'C') {
      this.clear();
    } else if (['+', '-', '*', '/'].includes(symbol)) {
      this.setOperator(symbol);
    } else if (symbol === '=') {
      this.calculate();
    }
  }

  private clear() {
    this.currentValue = '0';
    this.expression = '';
    this.operator = '';
    this.operand1 = null;
    this.operand2 = null;
  }

  private setOperator(operator: string) {
    if (this.operand1 === null) {
      this.operand1 = Number(this.currentValue);
    } else {
      this.calculate();
      this.operand1 = Number(this.currentValue);
    }
    this.operator = operator;
    this.currentValue = '0';
    this.expression += ` ${operator} `;
  }

  private calculate() {
    if (this.operand1 !== null && this.operator !== '') {
      this.operand2 = Number(this.currentValue);
      let result: number;

      switch (this.operator) {
        case '+':
          result = this.operand1 + this.operand2;
          break;
        case '-':
          result = this.operand1 - this.operand2;
          break;
        case '*':
          result = this.operand1 * this.operand2;
          break;
        case '/':
          result = this.operand1 / this.operand2;
          break;
        default:
          return;
      }

      this.currentValue = this.formatResult(result);
      this.operand1 = result;
      this.operator = '';
      this.operand2 = null;
    }
  }
  private formatResult(result: number): string {
    return result.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
}
