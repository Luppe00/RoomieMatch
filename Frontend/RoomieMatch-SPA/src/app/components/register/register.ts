import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { PreferenceService } from '../../services/preference.service';
import { RoomService } from '../../services/room.service';
import { TranslationService } from '../../services/translation.service';
import { User, Room, Preference } from '../../models';

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
        moveInDate: '',
        rentPeriod: '',
        roomSize: '',
        preferredGender: '',
        preferredAgeMin: undefined as number | undefined,
        preferredAgeMax: undefined as number | undefined,
        acceptsSmoker: ''
    };

    // Location checkboxes
    locationOptions = [
        { value: 'copenhagen-city', label: 'København (City)', checked: false },
        { value: 'frederiksberg', label: 'Frederiksberg', checked: false },
        { value: 'norrebro', label: 'Nørrebro', checked: false },
        { value: 'vesterbro', label: 'Vesterbro', checked: false },
        { value: 'osterbro', label: 'Østerbro', checked: false },
        { value: 'amager', label: 'Amager', checked: false },
        { value: 'valby', label: 'Valby', checked: false },
        { value: 'vanlose', label: 'Vanløse', checked: false },
        { value: 'gentofte', label: 'Gentofte', checked: false },
        { value: 'lyngby', label: 'Lyngby-Taarbæk', checked: false },
        { value: 'gladsaxe', label: 'Gladsaxe', checked: false },
        { value: 'hvidovre', label: 'Hvidovre', checked: false }
    ];

    // Rent period checkboxes
    rentPeriodOptions = [
        { value: 'under-6-months', label: 'Under 6 months', checked: false },
        { value: 'under-1-year', label: 'Under 1 year', checked: false },
        { value: 'over-1-year', label: 'Over 1 year', checked: false },
        { value: 'unlimited', label: 'Unlimited / Flexible', checked: false }
    ];

    error: string = '';
    loading: boolean = false;
    locationDropdownOpen: boolean = false;

    // Room photo upload
    roomPhotoPreview: string | null = null;
    roomPhotoFile: File | null = null;
    uploadingRoomPhoto: boolean = false;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private preferenceService: PreferenceService,
        private roomService: RoomService,
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

    toggleLocationDropdown() {
        this.locationDropdownOpen = !this.locationDropdownOpen;
    }

    selectAllLocations() {
        const allSelected = this.locationOptions.every(loc => loc.checked);
        this.locationOptions.forEach(loc => loc.checked = !allSelected);
    }

    getSelectedLocationsCount(): number {
        return this.locationOptions.filter(loc => loc.checked).length;
    }

    areAllLocationsSelected(): boolean {
        return this.locationOptions.every(loc => loc.checked);
    }

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
                        const storedUser = localStorage.getItem('user');
                        const currentUser = storedUser ? JSON.parse(storedUser) : null;

                        if (currentUser) {
                            // 1. Save Preferences (for both user types)
                            // Convert selected locations to comma-separated string
                            const selectedLocs = this.locationOptions
                                .filter(l => l.checked)
                                .map(l => l.label) // Use human-readable labels
                                .join(', ');

                            // Map frontend preference fields to backend field names
                            const preferenceData: Preference = {
                                id: 0, // Ignored by server
                                userId: currentUser.id,
                                maxRent: this.preferences.maxRent,
                                preferredLocation: selectedLocs, // Use selected locations
                                preferredLocations: selectedLocs,
                                preferredGender: this.preferences.preferredGender || 'Any',
                                minAgeRoomie: this.preferences.preferredAgeMin,
                                maxAgeRoomie: this.preferences.preferredAgeMax,
                                rentPeriod: this.preferences.rentPeriod,
                                smokerPreference: this.preferences.acceptsSmoker || undefined // Use acceptsSmoker from Step 2
                            };

                            console.log('Saving preferences:', preferenceData);

                            this.preferenceService.savePreference(currentUser.id, preferenceData).subscribe({
                                next: () => console.log('Preferences saved successfully'),
                                error: (e) => console.error('Error saving preferences', e)
                            });

                            // 2. If HAS_ROOM, also save room details
                            if (this.user.userType === 'HAS_ROOM' && this.room.rent && this.room.title && this.room.location) {
                                const roomData: Room = {
                                    ...this.room as Room,
                                    userId: currentUser.id,
                                    roomImage: undefined // Clear pending marker, will be set after upload
                                };
                                console.log('Creating room with data:', roomData);
                                this.roomService.createRoom(roomData).subscribe({
                                    next: (createdRoom) => {
                                        console.log('Room created:', createdRoom);
                                        // Upload photo if we have one
                                        if (this.roomPhotoFile && createdRoom.id) {
                                            console.log('Uploading room photo for room:', createdRoom.id);
                                            this.roomService.uploadRoomPhoto(createdRoom.id, this.roomPhotoFile).subscribe({
                                                next: (photoRes) => {
                                                    console.log('Room photo uploaded:', photoRes);
                                                    this.router.navigate(['/dashboard']);
                                                },
                                                error: (e) => {
                                                    console.error('Error uploading room photo', e);
                                                    alert('Room created but photo upload failed. You can add it later in Profile.');
                                                    this.router.navigate(['/dashboard']);
                                                }
                                            });
                                        } else {
                                            this.router.navigate(['/dashboard']);
                                        }
                                    },
                                    error: (e) => {
                                        console.error('Error saving room', e);
                                        alert('Failed to save room: ' + (e.error || e.message || 'Unknown error'));
                                        this.router.navigate(['/dashboard']);
                                    }
                                });
                            } else if (this.user.userType === 'HAS_ROOM') {
                                console.warn('Room not created - missing required fields:', { rent: this.room.rent, title: this.room.title, location: this.room.location });
                                alert('Room not created - please fill in Title, Location and Rent');
                                this.router.navigate(['/dashboard']);
                            } else {
                                this.router.navigate(['/dashboard']);
                            }
                        } else {
                            this.router.navigate(['/dashboard']);
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

    onRoomPhotoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.roomPhotoFile = input.files[0];

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.roomPhotoPreview = e.target?.result as string;
            };
            reader.readAsDataURL(this.roomPhotoFile);

            // Store in room object for later upload
            // The actual URL will be set after server upload during registration
            this.room.roomImage = 'pending';
        }
    }

    removeRoomPhoto(event: Event) {
        event.stopPropagation();
        this.roomPhotoPreview = null;
        this.roomPhotoFile = null;
        this.room.roomImage = undefined;
    }
}
