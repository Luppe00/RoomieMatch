import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preference } from '../models';

@Injectable({
    providedIn: 'root'
})
export class PreferenceService {
    private baseUrl = '/api/preferences';

    constructor(private http: HttpClient) { }

    getPreference(userId: number): Observable<Preference> {
        return this.http.get<Preference>(`${this.baseUrl}/${userId}`);
    }

    savePreference(userId: number, preference: Preference): Observable<Preference> {
        return this.http.put<Preference>(`${this.baseUrl}/${userId}`, preference);
    }
}
