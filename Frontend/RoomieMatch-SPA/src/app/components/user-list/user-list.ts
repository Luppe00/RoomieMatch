import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MatchService } from '../../services/match.service';
import { AuthService } from '../../services/auth.service';
import { PreferenceService } from '../../services/preference.service';
import { User, Preference } from '../../models';
import { SwipeCardComponent } from '../swipe-card/swipe-card';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  // Room detail modal state
  showDetailModal = false;
  selectedUser: User | null = null;
  showLightbox = false;
  lightboxImageIndex = 0;

  constructor(
    private userService: UserService,
    private matchService: MatchService,
    private authService: AuthService,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit() {
    // Use setTimeout to ensure this runs after Angular's initial change detection
    setTimeout(() => {
      this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser) {
        this.loadUsers();
      } else {
        this.loading = false;
      }
    }, 0);

    // Also subscribe to changes for live updates
    this.authService.currentUser$.subscribe(user => {
      if (user && !this.currentUser) {
        // User just logged in
        this.currentUser = user;
        this.loadUsers();
      } else if (!user && this.currentUser) {
        // User logged out
        this.currentUser = null;
        this.potentialMatches = [];
        this.loading = false;
      }
    });
  }

  loadUsers() {
    this.loading = true;

    if (!this.currentUser) {
      this.loading = false;
      return;
    }

    forkJoin({
      users: this.userService.getUsers(),
      preference: this.preferenceService.getPreference(this.currentUser.id).pipe(
        catchError(() => of(null as Preference | null)) // If no preference exists, return null
      )
    }).subscribe({
      next: ({ users, preference }) => {
        // Backend already filters by opposite userType, just exclude self
        this.potentialMatches = users.filter(u => {
          // 1. Exclude self
          if (u.id === this.currentUser?.id) return false;

          // If no preference, show all
          if (!preference) return true;

          // 2. Gender Preference
          if (preference.preferredGender && preference.preferredGender !== 'Any') {
            if (u.gender !== preference.preferredGender) return false;
          }

          // 3. Age Preference
          if (preference.minAgeRoomie && u.age < preference.minAgeRoomie) return false;
          if (preference.maxAgeRoomie && u.age > preference.maxAgeRoomie) return false;

          // 4. Room-specific filters (only for NEEDS_ROOM looking at HAS_ROOM users)
          if (u.room) {
            // Rent budget
            if (preference.maxRent && u.room.rent > preference.maxRent) return false;

            // Location check (if specific locations selected)
            if (preference.preferredLocations && preference.preferredLocations.length > 0) {
              const prefLocs = preference.preferredLocations.split(',');
              // Check if room location is in preferred list
              if (!prefLocs.some(loc => u.room?.location.includes(loc))) {
                return false;
              }
            }
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

  // Room Detail Modal Methods
  openDetailModal(user: User) {
    this.selectedUser = user;
    this.showDetailModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedUser = null;
    this.showLightbox = false;
    document.body.style.overflow = '';
  }

  likeFromModal() {
    this.closeDetailModal();
    this.onLike();
  }

  passFromModal() {
    this.closeDetailModal();
    this.onPass();
  }

  // Lightbox Methods
  openLightbox(index: number = 0) {
    this.lightboxImageIndex = index;
    this.showLightbox = true;
  }

  closeLightbox(event?: Event) {
    if (event) event.stopPropagation();
    this.showLightbox = false;
  }

  navigateLightbox(direction: number, event?: Event) {
    if (event) event.stopPropagation();
    // For now we only have one room image, but this supports multiple
    this.lightboxImageIndex += direction;
  }
}
