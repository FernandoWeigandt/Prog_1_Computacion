import { Component, Input } from '@angular/core';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styles: ``
})
export class CommentComponent {
  @Input() comment: string = '';
}
