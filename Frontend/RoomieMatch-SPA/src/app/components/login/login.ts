import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
        private router: Router
    ) { }

    onSubmit() {
        if (!this.email || !this.password) return;

        this.loading = true;
        this.error = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.router.navigate(['/']);
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Login failed. User not found or wrong password.';
                this.loading = false;
                console.error(err);
            }
            error: (err) => {
                this.error = 'An error occurred. Please try again.';
                this.loading = false;
                console.error(err);
            }
        });
    }
}
