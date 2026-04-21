import { BookType } from "@prisma/client";

export interface IBook {
    id?: string;
    bookName: string;
    writerName: string;
    category: string;
    totalPages?: number;
    totalSize?: string;
    length: string;
    language: string;
    formate: string;
    publisher: string;
    releaseDate: Date;
    price: number;
    description: string;
    coverImage: string;
    file: string;
    type: BookType; // enum
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export type IBookFilterRequest = {
    bookName?: string;
    writerName?: string;
    category?: string;
    language?: string;
    formate?: string;
    type?: BookType;
    searchTerm?: string;
  };
  