import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {
  @Input() searchActive: boolean = true
  @Input() settingsActive: boolean = true
  @Input() returnActive: boolean = false
  @Input() returnUrl: string = 'settings'
}
