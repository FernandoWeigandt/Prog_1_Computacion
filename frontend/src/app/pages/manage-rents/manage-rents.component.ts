import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-manage-rents',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent],
  templateUrl: './manage-rents.component.html',
  styles: ``
})
export class ManageRentsComponent {

}
