import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, Message } from '../../models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

  recipientId: number = 0;
  recipient: User | null = null;
  currentUser: User | null = null;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Get Recipient ID from route
    this.recipientId = Number(this.route.snapshot.paramMap.get('id'));

    // Get Current User
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        // Start SignalR
        this.chatService.createHubConnection(this.currentUser);
      }
    });

    // Get Recipient Details (for name/photo header)
    if (this.recipientId) {
      this.userService.getUser(this.recipientId).subscribe(user => {
        this.recipient = user;
      });

      // Load Messages
      this.chatService.getMessageThread(this.recipientId);
    }

    // Subscribe to messages
    this.chatService.messageThread$.subscribe(messages => {
      this.messages = messages;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.recipientId, this.newMessage).subscribe({
      next: (message) => {
        // Add the sent message to the local thread immediately
        this.messages = [...this.messages, message];
        this.newMessage = '';
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        alert('Failed to send message. Please try again.');
      }
    });
  }

  ngOnDestroy(): void {
    this.chatService.stopHubConnection();
  }
}
