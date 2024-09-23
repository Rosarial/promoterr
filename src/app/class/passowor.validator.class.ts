import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidator {
  static strong(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    if (!passwordValid) {
      return {
        strong:
          'Password must have at least one uppercase letter, one lowercase letter, one number, and one special character.'
      };
    }

    return null;
  }
}
