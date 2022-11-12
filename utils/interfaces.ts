export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    confirmed: string;
    confirmCode: string;
}

export interface Room {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    users: string[];
    messages: Message[];
}

export interface Message {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    room: Room;
}