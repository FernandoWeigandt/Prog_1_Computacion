import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'stars',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
  {{ rating.toFixed(1) }}
  <i *ngFor="let i of [].constructor(getStars(rating).fullStars)" class="bi bi-star-fill" style="color: gold;"></i>
  <i *ngIf="getStars(rating).halfStars" class="bi bi-star-half" style="color: gold;"></i>
  <i *ngFor="let i of [].constructor(getStars(rating).emptyStars)" class="bi bi-star" style="color: lightgray;"></i>
  `,
  styles: ``
})
export class StarsComponent {
  @Input() rating: number = 0;

  getStars(rating: number) {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return { fullStars, halfStars, emptyStars };
  }
}
