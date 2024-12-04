import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonComponent, ContextbarComponent, NavbarComponent, NgIf],
  templateUrl: './settings.component.html',
  styles: ``
})
export class SettingsComponent {

  constructor(private authService: AuthService) { }

  get token(): any {
    return this.authService.token;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLibrarian(): boolean {
    return this.authService.isLibrarian();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
