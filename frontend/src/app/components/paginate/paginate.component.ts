import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'component-paginate',
  standalone: true,
  imports: [NgFor],
  template: `
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" [class.disabled]="page === 1">
        <a class="page-link" (click)="goToPage(page - 1)" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li *ngFor="let pageNumber of range" class="page-item" [class.active]="page === pageNumber">
        <a class="page-link" (click)="goToPage(pageNumber)">{{ pageNumber }}</a>
      </li>
      <li class="page-item" [class.disabled]="page === pages">
        <a class="page-link" (click)="goToPage(page + 1)" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
  `,
  styles: ``
})
export class PaginateComponent {
  @Input() page: number = 1
  @Input() pages: number = 1
  @Output() pageChange = new EventEmitter<number>();

  get range(): number[] {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.pages) {
      this.page = pageNumber;
      this.pageChange.emit(pageNumber);
    }
  }
}
