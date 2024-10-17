import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonComponent, ContextbarComponent, NavbarComponent, NgIf],
  templateUrl: './settings.component.html',
  styles: ``
})
export class SettingsComponent {
  get token() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
