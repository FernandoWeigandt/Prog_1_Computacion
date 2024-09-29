import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { state } from '@angular/animations';

@Component({
  selector: 'app-select-users',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent],
  templateUrl: './select-users.component.html',
  styles: ``
})
export class SelectUsersComponent {
  users = [
    { name: 'John Doe', id: '123', state: 'debtor' },
    { name: 'Alice Johnson', id: '012', state: 'debtor' },
    { name: 'Emily Davis', id: '678', state: 'debtor' },
    { name: 'Jane Doe', id: '456', state: 'no_debt' },
    { name: 'Noah Miller', id: '013', state: 'no_debt' },
    { name: 'Bob Smith', id: '789', state: 'suspended'},
    { name: 'Michael Brown', id: '345', state: 'suspended' },
    { name: 'David Wilson', id: '901', state: 'suspended' }
  ]

  state2text(state: string): string {
    switch (state) {
      case 'debtor':
        return 'warning'
      case 'no_debt':
        return ''
      case 'suspended':
        return 'bad'
      default:
        return ''
    }
  }
}
