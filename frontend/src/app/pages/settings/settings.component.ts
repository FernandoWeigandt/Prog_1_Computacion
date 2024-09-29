import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonComponent, ContextbarComponent, NavbarComponent],
  templateUrl: './settings.component.html',
  styles: ``
})
export class SettingsComponent {

}
