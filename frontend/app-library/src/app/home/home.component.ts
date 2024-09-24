import { Component } from '@angular/core';
import { BookComponent } from '../book/book.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ContextbarComponent } from '../contextbar/contextbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, NavbarComponent, ContextbarComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

}
