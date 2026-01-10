import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.html',
    styleUrls: ['./register.css']
})
export class RegisterComponent {
export class RegisterComponent {
    password: string = '';

    user: Partial<User> = {
        firstName: '',
        lastName: '',
        email: '',
        age: undefined,
        gender: 'Male', // Default or require user selection
        bio: '',
        userType: 'NEEDS_ROOM'
    };

    error: string = '';
    loading: boolean = false;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit() {
        if (!this.password) {
            this.error = 'Password is required';
            return;
        }

        this.loading = true;
        this.error = '';

        const registerModel = {
            ...this.user,
            password: this.password
        };

        this.authService.register(registerModel).subscribe({
            next: () => {
                // Auto login after register
                this.authService.login({ email: this.user.email, password: this.password }).subscribe({
                    next: () => {
                        this.router.navigate(['/']);
                    },
                    error: () => {
                        this.router.navigate(['/login']);
                    }
                });
            },
            error: (err) => {
                console.error(err);
                this.error = 'Registration failed. Email might already be taken.';
                this.loading = false;
            }
        });
    }
}
