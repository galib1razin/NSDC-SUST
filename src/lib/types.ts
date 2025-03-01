// src/lib/types.ts
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'MEMBER' | 'ADMIN' | 'SUPERVISOR';
  }
  
  export interface Blog {
    id: number;
    title: string;
    content: string;
    image?: string;
    authorId: number;
    author: { name: string };
    createdAt: string; // DateTime from Prisma will be serialized as string
    approved: boolean;
    visible: boolean;
  }
  
  export interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: string; // DateTime serialized as string
  }