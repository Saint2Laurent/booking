export enum Role {
    MASTER,
    DESK,
    STAFF,
    CUSTOMER
}

export interface User {
    id: string;
    fullName: string;
    mail: string;
    password: string;
    isConfirmed: boolean;
    isGoogle: boolean;
    googleId?: string;
    profileImageUrl?: string;
    role: Role;
}