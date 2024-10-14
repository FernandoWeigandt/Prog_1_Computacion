import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginateComponent } from '../../components/paginate/paginate.component';


@Component({
  selector: 'app-select-users',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent, FormsModule, PaginateComponent],
  templateUrl: './select-users.component.html',
  styles: ``
})
export class SelectUsersComponent {

  searchQuery: string = '';
  users:any[] = [];
  filteredUsers:any[] = [];

  constructor(private router: Router, private usersService: UsersService) {
    
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((answer: any) => {
      console.log(answer);
      this.users = answer.users || [];
      this.filteredUsers = [...this.users]
    })
  }

  search() {
    this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

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
