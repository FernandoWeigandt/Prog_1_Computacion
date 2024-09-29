
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'component-loan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan.component.html',
  styles: ``
})
export class LoanComponent {
  @Input() title: string = '';
  @Input() initdate: Date = new Date(2024, 0, 1);
  @Input() expirationdate: Date = new Date(2024, 1, 1);
  @Input() state: string = '';
}
