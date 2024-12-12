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
  @Input() page: number = 1;
  @Input() pages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get range(): number[] {
    const rangeSize = 5;
    const halfRange = Math.floor(rangeSize / 2);

    let start = Math.max(1, this.page - halfRange);
    let end = Math.min(this.pages, this.page + halfRange);

    if (end - start + 1 < rangeSize) {
      if (start === 1) {
        end = Math.min(start + rangeSize - 1, this.pages);
      } else if (end === this.pages) {
        start = Math.max(end - rangeSize + 1, 1);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.pages) {
      this.page = pageNumber;
      this.pageChange.emit(pageNumber);
    }
  }
}
