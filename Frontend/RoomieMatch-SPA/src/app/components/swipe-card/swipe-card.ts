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
  @Output() liked = new EventEmitter<void>();
  @Output() passed = new EventEmitter<void>();

  onLike() {
    this.liked.emit();
  }

  onPass() {
    this.passed.emit();
  }
}
