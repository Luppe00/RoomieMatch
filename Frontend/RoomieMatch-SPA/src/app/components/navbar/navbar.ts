import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Standalone imports
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  currentUser: User | null = null;
  // Mock users for switching
  constructor(public authService: AuthService) {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  logout() {
    this.authService.logout();
  }
}
