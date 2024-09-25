import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-contextbar',
  standalone: true,
  imports: [],
  templateUrl: './contextbar.component.html',
  styles: ``
})
export class ContextbarComponent {
  @Input() title:string = 'Default title'
}
