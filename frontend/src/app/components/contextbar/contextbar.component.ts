import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-contextbar',
  standalone: true,
  imports: [],
  template: `
<div class="container py-3 bg-my-secondary bottom-rounded-div shadow fixed-top d-flex align-items-center justify-content-between component-contextbar" style="height: 92px; z-index: 1030;">
  <div class="d-flex align-items-center">
    <i class="bi bi-book-fill icon me-2" style="font-size: 2rem;"></i> <!-- Icono del libro -->
    <p class="mx-4 h1 mb-0"><strong>{{ shortenTitle(title, 30) }}</strong></p>
  </div>
</div>

  `,
  styles: `
.component-contextbar {
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
  height: 92px;
  z-index: 1030;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.component-contextbar .h1 {
  font-size: 1.75rem;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* Sombra de texto */
}

.component-contextbar .icon {
  font-size: 1.5rem;
  color: #fff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .component-contextbar .h1 {
    font-size: 1.5rem;
  }

  .component-contextbar i.icon {
    font-size: 1.2rem;
  }
}
`
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
