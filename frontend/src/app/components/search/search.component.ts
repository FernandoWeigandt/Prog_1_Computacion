import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { filter } from 'rxjs';

@Component({
  selector: 'component-search',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './search.component.html',
  styles: ``
})
export class SearchComponent {
  pattern: string = '';

  activeFilter: string = 'title';

  constructor(private searchService: SearchService) {}

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  clean() {
    console.log('Clean');
    this.searchService.searchQuery('clean');
  }

  search() {
    const searchQuery = {
      pattern: this.pattern,
      filter: this.activeFilter
    };
    if (this.pattern !== '') {
      this.searchService.searchQuery(searchQuery);
    }
  }
}
