import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MatchService } from '../../services/match.service';
import { AuthService } from '../../services/auth.service';
import { PreferenceService } from '../../services/preference.service';
import { User } from '../../models';
import { SwipeCardComponent } from '../swipe-card/swipe-card';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, SwipeCardComponent],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  potentialMatches: User[] = [];
  currentIndex = 0;
  currentUser: User | null = null;
  loading = true;
  matchMessage: string | null = null;

  constructor(
    private userService: UserService,
    private matchService: MatchService,
    private authService: AuthService,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUsers();
      } else {
        this.potentialMatches = [];
        this.loading = false;
      }
    });
  }

  loadUsers() {
    this.loading = true;

    if (!this.currentUser) return;

    forkJoin({
      users: this.userService.getUsers(),
      preference: this.preferenceService.getPreference(this.currentUser.id)
    }).subscribe({
      next: ({ users, preference }) => {
        // Backend already filters by opposite userType, just exclude self
        this.potentialMatches = users.filter(u => {
          // 1. Exclude self
          if (u.id === this.currentUser?.id) return false;

          // 2. Gender Preference (optional)
          if (preference && preference.preferredGender && preference.preferredGender !== 'Any') {
            if (u.gender !== preference.preferredGender) return false;
          }

          return true;
        });

        this.currentIndex = 0;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  get currentUserCard(): User | null {
    if (this.currentIndex < this.potentialMatches.length) {
      return this.potentialMatches[this.currentIndex];
    }
    return null;
  }

  onLike() {
    this.processSwipe(true);
  }

  onPass() {
    this.processSwipe(false);
  }

  processSwipe(liked: boolean) {
    if (!this.currentUser || !this.currentUserCard) return;

    const targetId = this.currentUserCard.id;

    this.matchService.swipe({
      swiperUserId: this.currentUser.id,
      targetUserId: targetId,
      liked: liked
    }).subscribe(response => {
      if (response.isMatch) {
        this.showMatchAnimation();
      }
      this.currentIndex++;
    });
  }

  showMatchAnimation() {
    this.matchMessage = "It's a Match!";
    setTimeout(() => this.matchMessage = null, 2000);
  }

  closeMatch() {
    this.matchMessage = null;
  }
}
