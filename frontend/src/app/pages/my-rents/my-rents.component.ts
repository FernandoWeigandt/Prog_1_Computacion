import { Component, OnInit } from '@angular/core';
import { ContextbarComponent } from "../../components/contextbar/contextbar.component";
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RentComponent } from '../../components/rent/rent.component';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-rents',
  standalone: true,
  imports: [RentComponent, ContextbarComponent, NavbarComponent],
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

  onRenewClicked(message: string) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const wrapper = document.createElement('div')
    let type = 'danger'
    if (message === 'Solicitud de renovación enviada a todos los bibliotecarios.') {
      type = 'dark'
    }
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    alertPlaceholder?.append(wrapper)
  }
}
