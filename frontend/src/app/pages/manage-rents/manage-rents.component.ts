import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RentsService } from '../../services/rents.service';
import { PaginateComponent } from '../../components/paginate/paginate.component';

@Component({
  selector: 'app-manage-rents',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent, PaginateComponent],
  templateUrl: './manage-rents.component.html',
  styles: ``
})
export class ManageRentsComponent {

  rents: any = []
  page: number = 0
  totalRents: number = 0
  pages: number = 0

  constructor(private rentsService: RentsService) { }

  ngOnInit(): void {
    this.getRents(1)
  }

  getRents(page:number) {
    this.rentsService.getRents(page).subscribe((answer: any) => {
      this.rents = answer.rents || [];
      this.page = answer.page;
      this.totalRents = answer.total;
      this.pages = answer.pages;
    })
  }

}
