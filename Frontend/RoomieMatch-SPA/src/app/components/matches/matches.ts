import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // id: 0
import { MatchService } from '../../services/match.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule],
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

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadMatches();
      }
    });
  }

  loadMatches() {
    if (!this.currentUser) return;
    this.matchService.getMatches(this.currentUser.id).subscribe(matches => {
      this.matches = matches;
    });
  }
}
