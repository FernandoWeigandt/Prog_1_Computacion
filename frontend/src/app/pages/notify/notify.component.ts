import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent],
  templateUrl: './notify.component.html',
  styles: ``
})
export class NotifyComponent {

}
