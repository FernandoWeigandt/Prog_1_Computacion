import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styles: ``
})
export class ButtonComponent {
  @Input() label:string = 'Default label'
  @Input() link:string = ''
  @Input() icon:string = 'bi bi-book'
}
