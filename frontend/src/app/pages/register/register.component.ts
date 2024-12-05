import { Component, inject } from '@angular/core';
import { ThumbnailBarComponent } from '../../components/thumbnail-bar/thumbnail-bar.component';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password1 = control.get('password1')?.value;
    const password2 = control.get('password2')?.value;
    if (password1 !== password2) {
      return { passwordMismatch: true };
    }
    return null;
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ThumbnailBarComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {

  private passwordPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

  constructor(private authService: AuthService) {}

  private fb = inject(NonNullableFormBuilder);

  registerForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    lastname: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    alias: ['', [
      Validators.maxLength(20),
    ]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
      Validators.minLength(10),
      Validators.maxLength(15)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50)
    ]],
    password: this.fb.group({
      password1: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]],
      password2: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]]},
    { 
      validators: passwordMatchValidator()
    })
  });

  get nameInvalid(): boolean {
    return this.registerForm.controls.name.invalid && (this.registerForm.controls.name.touched || this.registerForm.controls.name.dirty)
  }

  get lastnameInvalid(): boolean {
    return this.registerForm.controls.lastname.invalid && (this.registerForm.controls.lastname.touched || this.registerForm.controls.lastname.dirty)
  }

  get aliasInvalid(): boolean {
    return this.registerForm.controls.alias.invalid && (this.registerForm.controls.alias.touched || this.registerForm.controls.alias.dirty)
  }

  get phoneInvalid(): boolean {
    return this.registerForm.controls.phone.invalid && (this.registerForm.controls.phone.touched || this.registerForm.controls.phone.dirty)
  }

  get emailInvalid(): boolean {
    return this.registerForm.controls.email.invalid && (this.registerForm.controls.email.touched || this.registerForm.controls.email.dirty)
  }

  get passwordInvalid(): boolean {
    return this.registerForm.controls.password.invalid && (this.registerForm.controls.password.touched || this.registerForm.controls.password.dirty)
  }

  get password1Invalid(): boolean {
    return this.registerForm.controls.password.controls.password1.invalid && (this.registerForm.controls.password.controls.password1.touched || this.registerForm.controls.password.controls.password1.dirty)
  }

  get password2Invalid(): boolean {
    return this.registerForm.controls.password.controls.password2.invalid && (this.registerForm.controls.password.controls.password2.touched || this.registerForm.controls.password.controls.password2.dirty)
  }

  displayError(controlName:string, psk?:boolean): string | null {
    let control: any;
    if (psk) {
      control = this.registerForm.controls.password.get(controlName);
    } else {
      control = this.registerForm.get(controlName);
    }
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('pattern') && !psk) return 'El teléfono debe contener solo números';
    if (control?.hasError('minlength')) return `Este campo debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    if (control?.hasError('maxlength')) return `Este campo no debe superar los ${control.errors?.['maxlength'].requiredLength} caracteres`;
    if (control?.hasError('email')) return 'El correo electrónico no es válido';
    if (control?.hasError('pattern') && psk) return 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial (@$!%*?&)';
    if (control?.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return null;
  }

  togglePasswordVisibility(fieldId: string): void {
    const passwordField = document.getElementById(fieldId);
    const passwordFieldType = passwordField?.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField?.setAttribute('type', passwordFieldType);
  }

  submit() {
    const data = {
      'name': this.registerForm.controls.name.value,
      'lastname': this.registerForm.controls.lastname.value,
      'alias': this.registerForm.controls.alias.value,
      'phone': this.registerForm.controls.phone.value,
      'mail': this.registerForm.controls.email.value,
      'passwd': this.registerForm.controls.password.controls.password1.value
    } 
    console.log(data);
    this.authService.register(data).subscribe();
  }
}