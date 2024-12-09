import { Component, OnInit } from '@angular/core';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { ContextbarComponent } from "../../components/contextbar/contextbar.component";
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RentsService } from '../../services/rents.service';
import { RentComponent } from '../../components/rent/rent.component';

@Component({
  selector: 'app-my-rents',
  standalone: true,
  imports: [RentComponent, PaginateComponent, ContextbarComponent, NavbarComponent],
  templateUrl: './my-rents.component.html',
  styles: ``
})
export class MyRentsComponent implements OnInit {
  rents: any[] = []

  constructor(private rentsService: RentsService) {}

  ngOnInit(): void {
    this.rentsService.getRents().subscribe((answer: any) => {
      this.rents = answer.rents || [];
      console.log(answer.rents);
    })
  }
}
