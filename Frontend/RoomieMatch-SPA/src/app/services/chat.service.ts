import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { User, Message } from '../models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    hubUrl = '/chatHub';
    apiUrl = '/api';
    private hubConnection: HubConnection | undefined;

    // Real-time message thread
    private messageThreadSource = new BehaviorSubject<Message[]>([]);
    messageThread$ = this.messageThreadSource.asObservable();

    constructor(private http: HttpClient, private authService: AuthService) { }

    createHubConnection(user: User) {
        // If we have a token, SignalR usually needs it in the query string or header.
        // For simplicity, we assume the cookie or token is handled or public for now, 
        // BUT we should attach the token:
        const token = localStorage.getItem('token');

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => token || ''
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(error => console.log(error));

        // Listen for "NewMessage" from server
        this.hubConnection.on('NewMessage', (message: Message) => {
            this.messageThread$.pipe(take(1)).subscribe(messages => {
                this.messageThreadSource.next([...messages, message]);
            });
        });
    }

    stopHubConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }

    // API Fallback / Initial Load
    getMessageThread(recipientId: number) {
        return this.http.get<Message[]>(`${this.apiUrl}/messages/${recipientId}`).subscribe(messages => {
            this.messageThreadSource.next(messages);
        });
    }

    sendMessage(recipientId: number, content: string) {
        // We send via HTTP for simplicity and return Observable, letting SignalR handle the echo
        return this.http.post<Message>(`${this.apiUrl}/messages`, { recipientId, content });
    }
}
