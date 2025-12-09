import { Injectable } from '@angular/core'; // id: 0
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private userService: UserService) {
        // Attempt to restore user from localStorage if needed
        // For now, simple mock login
    }

    login(email: string): Observable<boolean> {
        return this.userService.getUsers().pipe(
            map(users => {
                const user = users.find(u => u.email === email);
                if (user) {
                    this.currentUserSubject.next(user);
                    return true;
                }
                return false;
            })
        );
    }

    logout() {
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
