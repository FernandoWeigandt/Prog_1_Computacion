import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [NavbarComponent, ContextbarComponent],
  templateUrl: './my-account.component.html',
  styles: ``
})
export class MyAccountComponent {

}
