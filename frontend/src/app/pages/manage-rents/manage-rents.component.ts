import { Component, inject } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RentsService } from '../../services/rents.service';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RentComponent } from '../../components/rent/rent.component';
import { NewRentComponent } from '../../components/new-rent/new-rent.component';
import { NewAuthorComponent } from "../../components/new-author/new-author.component";

@Component({
  selector: 'app-manage-rents',
  standalone: true,
  imports: [
    ContextbarComponent, 
    NavbarComponent, 
    PaginateComponent, 
    ReactiveFormsModule, 
    RentComponent, 
    NewRentComponent
  ],
  templateUrl: './manage-rents.component.html',
  styles: ``
})
export class ManageRentsComponent {

  rents: any = []
  page: number = 0
  totalRents: number = 0
  pages: number = 0

  private fb = inject(NonNullableFormBuilder)

  filterQueryForm = this.fb.group({
    rent_id: [''],
    user_name: [''],
    book_copy_id: [''],
    expiration_date: ['']
  })

  constructor(private rentsService: RentsService) { }

  ngOnInit(): void {
    this.getRents(1, [])
  }

  getRents(page:number, filters: any) {
    this.rentsService.getRents(page, filters).subscribe((answer: any) => {
      this.rents = answer.rents || [];
      this.page = answer.page;
      this.totalRents = answer.total;
      this.pages = answer.pages;
    })
  }

  getfilteredRents(page: number) {
    let query = ''
    if (this.filterQueryForm.controls.rent_id.value) {
      query += `rent_id=${this.filterQueryForm.value.rent_id}&`
    }
    if (this.filterQueryForm.controls.user_name.value) {
      query += `user_name=${this.filterQueryForm.value.user_name}&`
    }
    if (this.filterQueryForm.controls.book_copy_id.value) {
      query += `book_copy_id=${this.filterQueryForm.value.book_copy_id}&`
    }
    if (this.filterQueryForm.controls.expiration_date.value) {
      query += `expiration_date=${this.filterQueryForm.value.expiration_date}&`
    }
    this.getRents(page, query)
  }

  showAlert(message: string, type: 'danger' | 'success') {
    const alertPlaceholder = document.getElementById('rentAlertPlaceholder')
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    alertPlaceholder?.append(wrapper)
  }

  rentCreated() {
    this.showAlert('Prestamo creado exitosamente.', 'success')
    this.getRents(this.page, [])
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  errorRentCreated() {
    this.showAlert('Error al crear el prestamo.', 'danger')
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatedRent(message: string) {
    if (message[0] !== 'E'){
      this.showAlert(message, 'success')
      this.getRents(this.page, [])
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.showAlert(message, 'danger')
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onRenewClicked(message: string) {
    if (message === 'Solicitud de renovación enviada a todos los bibliotecarios.') {
      this.showAlert('Solicitud de renovación enviada a todos los bibliotecarios.', 'success')
    } else {
      this.showAlert(message, 'danger')
    }
  }
}