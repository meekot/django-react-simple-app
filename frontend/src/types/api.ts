export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}


export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author: number;
  author_username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest
  extends Pick<User, "username" | "email" | "first_name" | "last_name"> {
  password: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}
