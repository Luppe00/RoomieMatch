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

  // Animation state
  swipeDirection: 'left' | 'right' | null = null;

  onLike(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.swipeDirection = 'right';
    // Wait for animation to complete before emitting
    setTimeout(() => {
      this.liked.emit();
      this.swipeDirection = null;
    }, 400);
  }

  onPass(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.swipeDirection = 'left';
    setTimeout(() => {
      this.passed.emit();
      this.swipeDirection = null;
    }, 400);
  }
}
