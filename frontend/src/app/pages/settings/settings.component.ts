import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonComponent, ContextbarComponent, NavbarComponent],
  templateUrl: './settings.component.html',
  styles: ``
})
export class SettingsComponent {

  constructor(private authService: AuthService) { }

  get token(): any {
    return this.authService.token;
  }

  get isUser(): boolean {
    return this.authService.isUser();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isLibrarian(): boolean {
    return this.authService.isLibrarian();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
