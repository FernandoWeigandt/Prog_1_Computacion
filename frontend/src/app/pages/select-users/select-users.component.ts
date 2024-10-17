import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UsersService } from '../../services/users.service';
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
  totalUsers:number = 0;
  page:number = 1;
  pages:number = 1;
  filteredUsers:any[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {this.onPageChange(1)}

  search() {
    this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  onPageChange(page: number) {
    this.usersService.getUsers(page).subscribe((answer: any) => {
      console.log(answer);
      this.users = answer.users || [];
      this.filteredUsers = [...this.users]
      this.page = answer.page;
      this.totalUsers = answer.total;
      this.pages = answer.pages;
    })
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
