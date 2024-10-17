import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HomeComponent } from '../home/home.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HomeComponent, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  loginForm!: FormGroup;
  invalid_submit: boolean = false;
  invalid_auth: boolean = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      passwd: ['', [Validators.required, Validators.minLength(8)]]
    });
   }

  auth(dataLogin?: any) {
    this.authService.login(dataLogin).subscribe({
      next: (answer:any) => {
        localStorage.setItem('token', answer.access_token);
        window.location.href = '/home';
      }, error: (error: any) => {
        this.invalid_auth = true;
        console.error('Error: ', error);
        localStorage.removeItem('token');
      }, complete: () => {
        console.log('Complete');
      }
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.auth(this.loginForm.value);
    } else {
      this.invalid_submit = true;
    }
  }
}
