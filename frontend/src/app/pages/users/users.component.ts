import { Component, inject } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UsersService } from '../../services/users.service';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { UserComponent } from "../../components/user/user.component";
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-select-users',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent, FormsModule, PaginateComponent, UserComponent, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent {

  searchQuery: string = '';
  users:any[] = [];
  totalUsers:number = 0;
  page:number = 1;
  pages:number = 1;

  private fb = inject(NonNullableFormBuilder)

  filterQueryForm = this.fb.group({
    name: [''],
    lastname: [''],
    mail: [''],
    role: ['']
  })

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {this.getUsers(1, [])}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUsers(page: number, filters: any): void {
    this.usersService.getUsers(page, filters).subscribe((answer: any) => {
      this.users = answer.users || [];
      this.page = answer.page;
      this.totalUsers = answer.total;
      this.pages = answer.pages;
    })
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getfilteredUsers(page: number) {
    let filter = []
    if (this.filterQueryForm.controls.name.value) {
      filter.push({
        query: 'name',
        pattern: this.filterQueryForm.value.name
      })
    }
    if (this.filterQueryForm.controls.lastname.value) {
      filter.push({
        query: 'lastname',
        pattern: this.filterQueryForm.value.lastname
      })
    }
    if (this.filterQueryForm.controls.mail.value) {
      filter.push({
        query: 'mail',
        pattern: this.filterQueryForm.value.mail
      })
    }
    if (this.filterQueryForm.controls.role.value) {
      filter.push({
        query: 'role',
        pattern: this.filterQueryForm.value.role
      })
    }
    this.getUsers(page, filter);
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
