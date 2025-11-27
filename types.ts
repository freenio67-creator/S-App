export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  timestamp: string;
  tags: string[];
}

export interface CodeSnippet {
  id: string;
  title: string;
  html: string;
  css: string;
  js: string;
  updatedAt: string;
}

export interface ChartData {
  name: string;
  value: number;
}
