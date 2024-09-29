import { Component } from '@angular/core';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { LoanComponent } from '../../components/loan/loan.component';
import { ContextbarComponent } from "../../components/contextbar/contextbar.component";
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-my-rents',
  standalone: true,
  imports: [LoanComponent, PaginateComponent, ContextbarComponent, NavbarComponent],
  templateUrl: './my-rents.component.html',
  styles: ``
})
export class MyRentsComponent {

}
