import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User, Room } from '../../models';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.html',
    styleUrls: ['./register.css']
})
export class RegisterComponent {
    currentStep: number = 1;
    totalSteps: number = 3; // Always 3 steps: Type -> Details/Preferences -> Profile
    password: string = '';

    user: Partial<User> = {
        firstName: '',
        lastName: '',
        email: '',
        age: undefined,
        gender: undefined,
        bio: '',
        userType: undefined
    };

    // Room details for HAS_ROOM users
    room: Partial<Room> = {
        rent: undefined,
        deposit: undefined,
        location: '',
        sizeSqm: undefined,
        availableFrom: undefined,
        leasePeriod: '',
        title: '',
        description: ''
    };

    // Additional personal fields
    smoker: string = '';
    occupation: string = '';

    // Preferences for NEEDS_ROOM users
    preferences = {
        maxRent: undefined as number | undefined,
        preferredLocation: '',
        moveInDate: '',
        roomSize: '',
        preferredGender: '',
        preferredAgeMin: undefined as number | undefined,
        preferredAgeMax: undefined as number | undefined,
        acceptsSmoker: ''
    };

    error: string = '';
    loading: boolean = false;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) { }

    selectUserType(type: 'HAS_ROOM' | 'NEEDS_ROOM') {
        this.user.userType = type;
        // Both types now have 3 steps
        this.totalSteps = 3;
        this.nextStep();
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    canProceedStep2(): boolean {
        if (this.user.userType === 'HAS_ROOM') {
            return !!(this.room.rent && this.room.location && this.room.title);
        }
        // For NEEDS_ROOM, budget is required
        return !!(this.preferences.maxRent);
    }

    canProceedStep3(): boolean {
        return !!(
            this.user.firstName &&
            this.user.lastName &&
            this.user.email &&
            this.user.age &&
            this.user.gender &&
            this.password
        );
    }

    onSubmit() {
        if (!this.password) {
            this.error = 'Password is required';
            return;
        }

        this.loading = true;
        this.error = '';

        // Build bio from additional fields
        let fullBio = this.user.bio || '';
        if (this.occupation) {
            fullBio = `Occupation: ${this.occupation}. ` + fullBio;
        }
        if (this.smoker) {
            fullBio = `Smoker: ${this.smoker}. ` + fullBio;
        }

        const registerModel = {
            ...this.user,
            bio: fullBio,
            password: this.password
        };

        this.authService.register(registerModel).subscribe({
            next: () => {
                // Auto login after register
                this.authService.login({ email: this.user.email, password: this.password }).subscribe({
                    next: () => {
                        // If HAS_ROOM, save room details via profile update
                        if (this.user.userType === 'HAS_ROOM' && this.room.rent) {
                            const storedUser = localStorage.getItem('user');
                            const currentUser = storedUser ? JSON.parse(storedUser) : null;
                            if (currentUser) {
                                const updatedUser = { ...currentUser, room: this.room as Room };
                                this.userService.updateUser(currentUser.id!, updatedUser).subscribe({
                                    next: () => this.router.navigate(['/']),
                                    error: () => this.router.navigate(['/'])
                                });
                            } else {
                                this.router.navigate(['/']);
                            }
                        } else {
                            this.router.navigate(['/']);
                        }
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
