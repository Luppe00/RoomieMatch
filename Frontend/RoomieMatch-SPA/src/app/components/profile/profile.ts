import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PreferenceService } from '../../services/preference.service';
import { RoomService } from '../../services/room.service';
import { User, Preference, Room } from '../../models';
import { forkJoin, of } from 'rxjs';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    preference: Preference = {
        id: 0,
        userId: 0,
        maxRent: undefined,
        preferredLocation: '',
        minAgeRoomie: undefined,
        maxAgeRoomie: undefined
    };

    loading: boolean = true;
    saving: boolean = false;
    uploadingPhoto: boolean = false;
    uploadingRoomImage: boolean = false;
    message: string = '';
    error: string = '';

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private preferenceService: PreferenceService,
        private roomService: RoomService
    ) { }

    onFileSelected(event: any) {
        if (!this.user) return;
        const file: File = event.target.files[0];
        if (file) {
            this.uploadingPhoto = true;
            this.userService.uploadPhoto(this.user.id, file).subscribe({
                next: (res) => {
                    if (this.user) this.user.profileImage = res.url;
                    this.uploadingPhoto = false;
                    this.message = 'Photo uploaded successfully!';
                },
                error: (err) => {
                    console.error(err);
                    this.error = 'Photo upload failed';
                    this.uploadingPhoto = false;
                }
            });
        }
    }

    ngOnInit() {
        // Load immediately from localStorage (same pattern as Dashboard)
        this.initializeUser();

        // Also subscribe for live updates (login/logout)
        this.authService.currentUser$.subscribe(currentUser => {
            if (currentUser) {
                if (!this.user || this.user.id !== currentUser.id) {
                    this.user = { ...currentUser };
                    this.initializeRoom();
                    this.loadPreference(currentUser.id);
                }
            } else {
                this.user = null;
                this.loading = false;
            }
        });
    }

    private initializeUser() {
        // Read directly from localStorage (same pattern as Dashboard)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.loading = false; // Set loading false immediately - don't wait for preferences
            this.initializeRoom();
            this.loadPreference(this.user!.id);
        } else {
            this.loading = false;
        }
    }

    private initializeRoom() {
        if (this.user && this.user.userType === 'HAS_ROOM') {
            // Initialize with empty room FIRST so template renders the section
            this.user.room = {
                id: 0,
                userId: this.user.id,
                title: '',
                location: '',
                rent: 0,
                sizeSqm: 0,
                description: '',
                availableFrom: new Date().toISOString()
            };

            // Then fetch from backend and update if room exists
            this.roomService.getRoomByUserId(this.user.id).subscribe({
                next: (rooms) => {
                    if (rooms && rooms.length > 0) {
                        // Update with existing room from database
                        this.user!.room = rooms[0];
                    }
                    // If no rooms found, keep the empty one we set above
                },
                error: (e) => {
                    console.error('Error fetching room', e);
                    // Keep the empty room we set above
                }
            });
        }
    }

    loadPreference(userId: number) {
        this.preferenceService.getPreference(userId).subscribe({
            next: (pref) => {
                if (pref) {
                    this.preference = pref;
                } else {
                    this.preference.userId = userId;
                }
                this.loading = false;
            },
            error: (err) => {
                if (err.status === 404) {
                    this.preference.userId = userId;
                }
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (!this.user) return;

        this.saving = true;
        this.message = '';
        this.error = '';

        // 1. Update User
        const updateUser$ = this.userService.updateUser(this.user.id, this.user);

        // 2. Create or Update Preference (Upsert)
        this.preference.userId = this.user.id;
        const savePreference$ = this.preferenceService.savePreference(this.user.id, this.preference);

        // 3. Save Room if applicable
        let saveRoom$: import('rxjs').Observable<any> = of(null); // Default observable
        if (this.user.userType === 'HAS_ROOM' && this.user.room) {
            this.user.room.userId = this.user.id;
            if (this.user.room.id && this.user.room.id > 0) {
                saveRoom$ = this.roomService.updateRoom(this.user.room.id, this.user.room);
            } else {
                saveRoom$ = this.roomService.createRoom(this.user.room);
            }
        }

        forkJoin([updateUser$, savePreference$, saveRoom$]).subscribe({
            next: () => {
                this.message = 'Profile updated successfully!';
                this.saving = false;
                // Also update local auth state if needed, though usually re-fetching is safer
            },
            error: (err) => {
                console.error(err);
                this.error = 'Failed to update profile.';
                this.saving = false;
            }
        });
    }

    getProfileCompletion(): number {
        if (!this.user) return 0;

        let score = 0;
        const weights = {
            firstName: 10,
            lastName: 10,
            age: 10,
            gender: 10,
            bio: 20,
            profileImage: 25,
            room: 15 // Only for HAS_ROOM users
        };

        if (this.user.firstName) score += weights.firstName;
        if (this.user.lastName) score += weights.lastName;
        if (this.user.age) score += weights.age;
        if (this.user.gender) score += weights.gender;
        if (this.user.bio && this.user.bio.length > 10) score += weights.bio;
        if (this.user.profileImage) score += weights.profileImage;

        // Room details only count for HAS_ROOM
        if (this.user.userType === 'HAS_ROOM') {
            if (this.user.room && this.user.room.rent && this.user.room.location) {
                score += weights.room;
            }
        } else {
            // For NEEDS_ROOM, redistribute room weight to other fields
            score = Math.round(score * (100 / 85));
        }

        return Math.min(score, 100);
    }

    getMissingFields(): string[] {
        if (!this.user) return [];

        const missing: string[] = [];

        if (!this.user.firstName) missing.push('First Name');
        if (!this.user.lastName) missing.push('Last Name');
        if (!this.user.age) missing.push('Age');
        if (!this.user.gender) missing.push('Gender');
        if (!this.user.bio || this.user.bio.length < 10) missing.push('Bio (min 10 chars)');
        if (!this.user.profileImage) missing.push('Profile Photo');

        if (this.user.userType === 'HAS_ROOM') {
            if (!this.user.room?.rent) missing.push('Room Rent');
            if (!this.user.room?.location) missing.push('Room Location');
        }

        return missing;
    }

    onRoomImageSelected(event: Event) {
        if (!this.user?.room || !this.user.room.id) {
            this.error = 'Please save your room first before uploading an image.';
            return;
        }
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.uploadingRoomImage = true;
            this.error = '';

            // Upload to Cloudinary via backend
            this.roomService.uploadRoomPhoto(this.user.room.id, file).subscribe({
                next: (res) => {
                    if (this.user?.room) {
                        this.user.room.roomImage = res.url;
                    }
                    this.uploadingRoomImage = false;
                    this.message = 'Room photo uploaded successfully!';
                },
                error: (err) => {
                    console.error('Error uploading room photo', err);
                    this.error = 'Failed to upload room photo.';
                    this.uploadingRoomImage = false;
                }
            });
        }
    }

    // Handle multiple room image selection
    onRoomImagesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.uploadingRoomImage = true;

            // Initialize roomImages array if needed
            if (this.user?.room && !this.user.room.roomImages) {
                this.user.room.roomImages = [];
            }

            const filesToProcess = Array.from(input.files);
            const maxPhotos = 5;
            const currentCount = this.user?.room?.roomImages?.length || 0;
            const remainingSlots = maxPhotos - currentCount;
            const filesToAdd = filesToProcess.slice(0, remainingSlots);

            let processedCount = 0;
            filesToAdd.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (this.user?.room) {
                        this.user.room.roomImages = this.user.room.roomImages || [];
                        this.user.room.roomImages.push(e.target?.result as string);

                        // Also set first image as primary
                        if (!this.user.room.roomImage) {
                            this.user.room.roomImage = e.target?.result as string;
                        }
                    }
                    processedCount++;
                    if (processedCount === filesToAdd.length) {
                        this.uploadingRoomImage = false;
                    }
                };
                reader.readAsDataURL(file);
            });

            // Reset input so same file can be selected again
            input.value = '';
        }
    }

    removeRoomImage(event: Event, index: number) {
        event.stopPropagation();
        if (this.user?.room?.roomImages) {
            this.user.room.roomImages.splice(index, 1);
            // Update primary image
            if (this.user.room.roomImages.length > 0) {
                this.user.room.roomImage = this.user.room.roomImages[0];
            } else {
                this.user.room.roomImage = undefined;
            }
        }
    }
}
