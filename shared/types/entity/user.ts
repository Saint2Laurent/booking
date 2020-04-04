export type UserRole = 'MASTER' | 'DESK' | 'STAFF' | 'CUSTOMER';

// the returned payload inside the token
export interface UserPayload {
  
  _id: string;
 
}

export interface User {
  id: string;
  mail: string;
  password: string;
  fullName: string;
  isGoogle: boolean;
  googleId: string;
  role: UserRole;
  createdAt: string;
}

export interface UserPartial extends Partial<User> {}

export interface Parent {
  _:any
}
