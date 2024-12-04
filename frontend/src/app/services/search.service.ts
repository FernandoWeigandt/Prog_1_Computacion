import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchQuerySubject = new Subject<string>();

  searchQuery$ = this.searchQuerySubject.asObservable();

  searchQuery(query: any) {
    this.searchQuerySubject.next(query);
  }
}
