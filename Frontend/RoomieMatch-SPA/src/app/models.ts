export interface User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    bio?: string;
    userType: 'HAS_ROOM' | 'NEEDS_ROOM';
    profileImage?: string;

    // Improvement 1: Include Room Details
    room?: Room;

    createdAt: string; // DateTime comes as ISO string
}

export interface Room {
    id: number;
    userId: number;
    title: string;
    location: string;
    rent: number;
    deposit?: number;
    sizeSqm?: number;
    roomImage?: string;
    description?: string;
    availableFrom?: string; // DateTime
    leasePeriod?: string;
}

export interface Swipe {
    id: number;
    swiperUserId: number;
    targetUserId: number;
    liked: boolean;
    createdAt: string; // DateTime
}

export interface Match {
    id: number;
    userAId: number;
    userBId: number;
    createdAt: string; // DateTime
}

export interface Preference {
    id: number;
    userId: number;
    maxRent?: number;
    preferredLocation?: string;
    preferredGender?: string;
    minAgeRoomie?: number;
    maxAgeRoomie?: number;
}

export interface Message {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    dateSent: Date;
    dateRead?: Date;
    senderName?: string; // Optional helpers
    recipientName?: string;
}

export interface SwipeResponse {
    isMatch: boolean;
}
