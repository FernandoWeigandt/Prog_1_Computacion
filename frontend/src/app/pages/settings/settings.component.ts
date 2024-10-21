import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgIf } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonComponent, ContextbarComponent, NavbarComponent, NgIf],
  templateUrl: './settings.component.html',
  styles: ``
})
export class SettingsComponent {

  isLibrarian() {
    return this.role === 'librarian';
  }

  isAdmin() {
    return this.role === 'admin';
  }

  get token(): any {
    return localStorage.getItem('token');
  }

  get role() {
    const decoded: any = jwtDecode(this.token);
    return decoded.role;
  }

  logout() {
    localStorage.removeItem('token');
  }
}
