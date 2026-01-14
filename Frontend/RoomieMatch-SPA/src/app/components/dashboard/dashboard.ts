import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatchService } from '../../services/match.service';
import { ChatService } from '../../services/chat.service';
import { TranslationService } from '../../services/translation.service';
import { User } from '../../models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
    currentUser: User | null = null;
    matchedUsers: User[] = [];
    unreadCount: number = 0;
    loading: boolean = true;

    // Stats
    totalMatches: number = 0;
    newMatchesToday: number = 0;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private matchService: MatchService,
        private chatService: ChatService,
        private translationService: TranslationService,
        private cdr: ChangeDetectorRef
    ) {
        this.translationService.currentLang$.subscribe(() => {
            this.cdr.detectChanges();
        });
    }

    t(key: string): string {
        return this.translationService.t(key);
    }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.loading = false;
            this.cdr.detectChanges(); // Force update immediately
            this.loadMatches();
            this.loadUnreadCount();
        } else {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    loadMatches() {
        if (!this.currentUser) return;

        this.matchService.getMatches(this.currentUser.id).subscribe({
            next: (users: User[]) => {
                this.matchedUsers = users.slice(0, 3); // First 3 for preview
                this.totalMatches = users.length;
                this.newMatchesToday = 0;
                this.cdr.detectChanges(); // Force update after data loads
            },
            error: (err: any) => console.error('Error loading matches', err)
        });
    }

    loadUnreadCount() {
        if (!this.currentUser) return;

        this.chatService.getUnreadCount().subscribe({
            next: (response: { count: number }) => this.unreadCount = response.count,
            error: (err: any) => console.error('Error loading unread count', err)
        });
    }

    getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return this.t('dashboard.goodMorning');
        if (hour < 18) return this.t('dashboard.goodAfternoon');
        return this.t('dashboard.goodEvening');
    }

    getProfileCompletion(): number {
        if (!this.currentUser) return 0;
        let score = 0;
        if (this.currentUser.firstName) score += 15;
        if (this.currentUser.lastName) score += 15;
        if (this.currentUser.age) score += 10;
        if (this.currentUser.gender) score += 10;
        if (this.currentUser.bio) score += 20;
        if (this.currentUser.profileImage) score += 30;
        return score;
    }
}
