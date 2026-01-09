import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models';

@Component({
  selector: 'app-swipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipe-card.html',
  styleUrls: ['./swipe-card.css']
})
export class SwipeCardComponent {
  @Input() user!: User;

  // @Output: Signals sent UP to the parent
  @Output() liked = new EventEmitter<void>();
  @Output() passed = new EventEmitter<void>();

 //Angular component, connects when we click like. We use the SwipeService to send the data to the BackEnd.
  onLike() {
    this.liked.emit(); // Sends signal to parent
  }

  onPass() {
    this.passed.emit();
  }
}
