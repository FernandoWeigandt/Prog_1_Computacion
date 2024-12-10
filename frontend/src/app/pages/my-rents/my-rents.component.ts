import { Component, OnInit } from '@angular/core';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { ContextbarComponent } from "../../components/contextbar/contextbar.component";
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RentComponent } from '../../components/rent/rent.component';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-rents',
  standalone: true,
  imports: [RentComponent, PaginateComponent, ContextbarComponent, NavbarComponent],
  templateUrl: './my-rents.component.html',
  styles: ``
})
export class MyRentsComponent implements OnInit {
  rents: any[] = []

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id: number = Number(this.authService.userId) || 0;
    this.userService.getUser(id).subscribe((answer: any) => {
      this.rents = answer.rents || [];
    })
  }
}
