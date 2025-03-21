import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styles: ``
})
export class UserComponent {
  @Input() user: any = {}
  @Output() roleUpdated = new EventEmitter
  @Output() errorRoleUpdate = new EventEmitter

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}
  
  get isAdmin() {
    return this.authService.isAdmin();
  }

  get colorStatus() {
    return 
  }

  get role() {
    switch (this.user.role) {
      case 'user':
        return 'Usuario';
      case 'admin':
        return 'Administrador'
      case 'librarian':
        return 'Bibliotecario'
      default:
        return 'Pendiente';
    }
  }

  get roleColor() {
    switch (this.user.role) {
      case 'user':
        return 'primary';
      case 'admin':
        return 'success'
      case 'librarian':
        return 'secondary'
      default:
        return 'warning';
    }
  }

  get state() {
    switch (this.user.state) {
      case 'debtor':
        return 'Deudor';
      case 'active':
        return 'Sin deuda';
      case 'inactive':
        return 'Sin prestamos';
      default:
        return 'Pendiente';
    }
  }

  get stateColor() {
    switch (this.user.state) {
      case 'debtor':
        return 'danger';
      case 'active':
        return 'primary';
      case 'inactive':
        return ''
      default:
        return '';
    }
  }

  newRole(role: string) {

    switch (role) {
      case 'user':
        return 'Usuario';
      case 'admin':
        return 'Administrador'
      case 'librarian':
        return 'Bibliotecario'
      default:
        return 'Pendiente';
    }
  }

  saveRole(role: string) {
    this.usersService.updateUser(this.user.id, { role: role }).subscribe(() => {
      this.roleUpdated.emit(`Usuario ${this.user.mail} actualizado con rol ${this.newRole(role)}.`);
    }, (error) => {
      this.errorRoleUpdate.emit(`Error al actualizar el rol de ${this.user.mail}.`);
    });
  }
}
