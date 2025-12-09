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
        this.loading = true;
        this.error = '';

        // Create user
        const newUser = {
            ...this.user,
            createdAt: new Date().toISOString()
        } as User;

        this.userService.createUser(newUser).subscribe({
            next: (createdUser) => {
                // Auto login
                this.authService.login(createdUser.email).subscribe(success => {
                    if (success) {
                        this.router.navigate(['/']);
                    } else {
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
