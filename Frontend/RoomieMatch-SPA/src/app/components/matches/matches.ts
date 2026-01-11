import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matches.html',
  styleUrls: ['./matches.css']
})
export class MatchesComponent implements OnInit {
  matches: User[] = [];
  currentUser: User | null = null;

  constructor(
    private matchService: MatchService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  // ngOnInit: Runs automatically when the page loads.
  // It checks who is logged in, then asks for their matches.
  ngOnInit() {
    // Load immediately from localStorage (same pattern as Profile)
    this.initializeUser();

    // Subscribe for live updates
    this.authService.currentUser$.subscribe(user => {
      if (user && !this.currentUser) {
        this.currentUser = user;
        this.loadMatches();
        this.cdr.detectChanges(); // Force update
      }
    });
  }

  private initializeUser() {
    // Read directly from localStorage (same pattern as Profile)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.loadMatches();
      this.cdr.detectChanges(); // Force update immediately
    }
  }

  // Ask the Service to fetch data from the API
  loadMatches() {
    if (!this.currentUser) return;
    this.matchService.getMatches(this.currentUser.id).subscribe(matches => {
      this.matches = matches;
      this.cdr.detectChanges(); // Force update after data loads
    });
  }
}
