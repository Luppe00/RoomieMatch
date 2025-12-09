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
    message: string = '';
    error: string = '';

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private preferenceService: PreferenceService,
        private roomService: RoomService
    ) { }

    ngOnInit() {
        this.authService.currentUser$.subscribe(currentUser => {
            if (currentUser) {
                this.user = { ...currentUser }; // Clone

                // Initialize room if HAS_ROOM but no room data exists
                if (this.user.userType === 'HAS_ROOM' && !this.user.room) {
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
                }

                this.loadPreference(currentUser.id);
            } else {
                this.loading = false;
            }
        });
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
}
