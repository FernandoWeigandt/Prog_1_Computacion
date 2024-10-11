import { Component } from '@angular/core';

@Component({
  selector: 'thumbnail-bar',
  standalone: true,
  imports: [],
  template: `
<header>
  <div class="container-sm bg-my-secondary py-4 bottom-rounded-div shadow text-center mb-4" style="height: 131px; position: relative;">
    <img src="media/book-thumbnail.jpg" alt="Libros" class="img-fluid rounded-circle shadow-sm mt-3" style="height: 114px;">
  </div>
</header>
  `,
  styles: ``
})
export class ThumbnailBarComponent {

}
