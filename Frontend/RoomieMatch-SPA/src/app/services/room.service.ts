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

    uploadRoomPhoto(roomId: number, file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/${roomId}/upload-photo`, formData);
    }

    addRoomPhoto(roomId: number, file: File): Observable<{ url: string, allPhotos: string[] }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string, allPhotos: string[] }>(`${this.apiUrl}/${roomId}/add-photo`, formData);
    }

    removeRoomPhoto(roomId: number, photoUrl: string, room: Room): Observable<void> {
        // Remove photo from array and update room
        const updatedPhotos = (room.roomImages || []).filter(p => p !== photoUrl);
        room.roomImages = updatedPhotos;
        // Update primary if needed
        if (room.roomImage === photoUrl) {
            room.roomImage = updatedPhotos.length > 0 ? updatedPhotos[0] : undefined;
        }
        return this.updateRoom(roomId, room);
    }
}
