import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'component-search',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './search.component.html',
  styles: ``
})
export class SearchComponent {
  @Input() filters: any[] = [];
  @Input() activeFilter: string = '';

  pattern: string = '';


  constructor(private searchService: SearchService) {}

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  clean() {
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
