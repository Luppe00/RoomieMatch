import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Swipe, SwipeResponse, User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private baseUrl = '/api';

    constructor(private http: HttpClient) { }

    swipe(swipe: Omit<Swipe, 'id' | 'createdAt'>): Observable<SwipeResponse> {
        return this.http.post<SwipeResponse>(`${this.baseUrl}/swipes`, swipe);
    }

    getMatches(userId: number): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/matches/${userId}`);
    }
}
