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
    error: string = '';
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit() {
        if (!this.email) return;

        this.loading = true;
        this.error = '';

        this.authService.login(this.email).subscribe({
            next: (success) => {
                if (success) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Login failed. User not found. Please register.';
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'An error occurred. Please try again.';
                this.loading = false;
                console.error(err);
            }
        });
    }
}
