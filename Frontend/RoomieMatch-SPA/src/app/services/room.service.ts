import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models';

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    private apiUrl = '/api/rooms';

    constructor(private http: HttpClient) { }

    createRoom(room: Room): Observable<Room> {
        return this.http.post<Room>(this.apiUrl, room);
    }

    updateRoom(id: number, room: Room): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, room);
    }

    getRoomByUserId(userId: number): Observable<Room[]> {
        return this.http.get<Room[]>(`${this.apiUrl}/user/${userId}`);
    }
}
