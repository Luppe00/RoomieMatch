import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { TranslationService, Language } from '../../services/translation.service';
import { User } from '../../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isDarkMode: boolean = false;
  unreadCount: number = 0;
  currentLang: Language = 'da';

  constructor(
    public authService: AuthService,
    private chatService: ChatService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    // Read from localStorage IMMEDIATELY - same pattern as Dashboard
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.loadUnreadCount();
    }

    // Also subscribe for live updates (login/logout)
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUnreadCount();
      }
    });

    // Subscribe to language changes
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    // Load dark mode preference from localStorage
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyDarkMode();
    this.currentLang = this.translationService.language;
  }

  loadUnreadCount() {
    this.chatService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount = res.count,
      error: () => this.unreadCount = 0
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    this.applyDarkMode();
  }

  private applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleLanguage() {
    this.translationService.toggleLanguage();
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  logout() {
    this.authService.logout();
  }
}
