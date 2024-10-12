import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-contextbar',
  standalone: true,
  imports: [],
  template: `
  <div class="container py-4 bg-my-secondary bottom-rounded-div shadow fixed-top d-flex align-items-center" style="height: 104px; z-index: 1030;">
    <p class="mx-4 h1"><strong>{{ shortenTitle(title, 20) }}</strong></p>
  </div>
  `,
  styles: ``
})
export class ContextbarComponent {
  @Input() title:string = 'Default title'

  shortenTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  }
}
