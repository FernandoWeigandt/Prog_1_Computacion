import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../register/register.component';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [NavbarComponent, ContextbarComponent, ReactiveFormsModule],
  templateUrl: './my-account.component.html',
  styles: ``
})
export class MyAccountComponent implements OnInit {
  
  user: any = {}

  private passwordPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

  ngOnInit() {
    this.getUser()
  }

  getUser() {
    const user_id = Number(this.authService.userId)
    this.userService.getUser(user_id).subscribe((answer) => {
      this.user = answer
    }, (error) => {
      console.error(error)
    })
  }

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  private fb = inject(NonNullableFormBuilder);

  updateUserForm = this.fb.group({
    name: [this.user?.name, [
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    lastname: [this.user?.lastname, [
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    alias: [this.user?.alias, [
      Validators.maxLength(20),
    ]],
    phone: [this.user?.phone, [
      Validators.pattern(/^[0-9]*$/),
      Validators.minLength(10),
      Validators.maxLength(15)
    ]],
    email: [this.user.mail, [
      Validators.email,
      Validators.maxLength(50)
    ]],
    password: this.fb.group({
      password1: ['', [
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]],
      password2: ['', [
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]]},
    { 
      validators: passwordMatchValidator()
    })
  });

  get nameInvalid(): boolean {
    return this.updateUserForm.controls.name.invalid && (this.updateUserForm.controls.name.touched || this.updateUserForm.controls.name.dirty)
  }

  get lastnameInvalid(): boolean {
    return this.updateUserForm.controls.lastname.invalid && (this.updateUserForm.controls.lastname.touched || this.updateUserForm.controls.lastname.dirty)
  }

  get aliasInvalid(): boolean {
    return this.updateUserForm.controls.alias.invalid && (this.updateUserForm.controls.alias.touched || this.updateUserForm.controls.alias.dirty)
  }

  get phoneInvalid(): boolean {
    return this.updateUserForm.controls.phone.invalid && (this.updateUserForm.controls.phone.touched || this.updateUserForm.controls.phone.dirty)
  }

  get emailInvalid(): boolean {
    return this.updateUserForm.controls.email.invalid && (this.updateUserForm.controls.email.touched || this.updateUserForm.controls.email.dirty)
  }

  get passwordInvalid(): boolean {
    return this.updateUserForm.controls.password.invalid && (this.updateUserForm.controls.password.touched || this.updateUserForm.controls.password.dirty)
  }

  get password1Invalid(): boolean {
    return this.updateUserForm.controls.password.controls.password1.invalid && (this.updateUserForm.controls.password.controls.password1.touched || this.updateUserForm.controls.password.controls.password1.dirty)
  }

  get password2Invalid(): boolean {
    return this.updateUserForm.controls.password.controls.password2.invalid && (this.updateUserForm.controls.password.controls.password2.touched || this.updateUserForm.controls.password.controls.password2.dirty)
  }

  displayError(controlName:string, psk?:boolean): string | null {
    let control: any;
    if (psk) {
      control = this.updateUserForm.controls.password.get(controlName);
    } else {
      control = this.updateUserForm.get(controlName);
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
      'name': this.updateUserForm.controls.name.value,
      'lastname': this.updateUserForm.controls.lastname.value,
      'alias': this.updateUserForm.controls.alias.value,
      'phone': this.updateUserForm.controls.phone.value,
      'mail': this.updateUserForm.controls.email.value,
      'passwd': this.updateUserForm.controls.password.controls.password1.value
    } 
    this.userService.updateUser(Number(this.authService.userId), data).subscribe(() => {
      this.getUser()
      this.updateUserForm.reset()
      document.documentElement.scrollTo({ top:0, behavior: 'smooth'})
    });
  }

  deleteUser() {
    this.userService.deleteUser(Number(this.authService.userId))
  }
}
