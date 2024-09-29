import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  template: `
  <div class="container error-container">
    <div class="p-5 text-center bg-my-secondary bottom-rounded-div shadow-lg">
      <h1 class="text-my-color error-message">404</h1>
      <p class="text-my-color error-description">Página no encontrada</p>
      <a href="home" class="btn btn-my-primary btn-lg">Volver al inicio</a>
    </div>
  </div>
  `,
  styles: ``
})
export class ErrorComponent {

}
