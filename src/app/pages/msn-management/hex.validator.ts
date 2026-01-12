import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hexValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && (!/^[0-9A-F]{2}$/i.test(value) || parseInt(value, 16) > 255)) {
            return { invalidHex: { value } };
        }
        return null;
    };
}
