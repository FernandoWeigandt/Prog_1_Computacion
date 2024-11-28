import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { SearchComponent } from '../../components/search/search.component';
import { SearchService } from '../../services/search.service';


@Component({
  selector: 'app-select-users',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent, FormsModule, PaginateComponent, SearchComponent],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent {

  searchQuery: string = '';
  users:any[] = [];
  totalUsers:number = 0;
  page:number = 1;
  pages:number = 1;

  constructor(
    private usersService: UsersService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {this.getUsers(1), this.search()}

  search(): void {
    this.searchService.searchQuery$.subscribe((searchQuery) => {
      this.searchQuery = searchQuery;
      if (this.searchQuery === 'clean') {
        sessionStorage.removeItem('currentPage');
        this.getUsers(1);
      } else {
        this.getUsers(1, [{key: 'name', value: this.searchQuery}])
      }
    });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getUsers(page: number, filters: any = []): void {
    this.usersService.getUsers(page, filters).subscribe((answer: any) => {
      this.users = answer.users || [];
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
