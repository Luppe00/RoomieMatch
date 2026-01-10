import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private baseUrl = '/api/auth';

    constructor(private http: HttpClient) {
        // Restore session if token exists
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            this.currentUserSubject.next(JSON.parse(userStr));
        }
    }

    login(model: any): Observable<void> {
        return this.http.post<any>(this.baseUrl + '/login', model).pipe(
            map(response => {
                const user = response.user;
                if (user && response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            })
        );
    }

    register(model: any): Observable<void> {
        return this.http.post<any>(this.baseUrl + '/register', model).pipe(
            map(() => {
                // After register, you might want to auto-login or just return
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
