import { Component, OnInit } from '@angular/core';
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
    private authService: AuthService
  ) { }

  // ngOnInit: Runs automatically when the page loads.
  // It checks who is logged in, then asks for their matches.
  ngOnInit() {
    // Read directly from localStorage (same pattern as Dashboard/Profile)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.loadMatches();
    }

    // Subscribe for live updates
    this.authService.currentUser$.subscribe(user => {
      if (user && !this.currentUser) {
        this.currentUser = user;
        this.loadMatches();
      }
    });
  }

  // Ask the Service to fetch data from the API
  loadMatches() {
    if (!this.currentUser) return;
    this.matchService.getMatches(this.currentUser.id).subscribe(matches => {
      this.matches = matches;
    });
  }
}
