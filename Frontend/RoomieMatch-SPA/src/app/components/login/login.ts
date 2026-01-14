import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    error: string = '';
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
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

    onSubmit() {
        if (!this.email || !this.password) return;

        this.loading = true;
        this.error = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
                this.loading = false;
            },
            error: (err) => {
                this.error = this.t('login.error');
                this.loading = false;
                console.error(err);
            }
        });
    }
}
