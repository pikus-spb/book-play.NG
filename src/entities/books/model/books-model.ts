export interface BookDescription {
  id: number;
  authorFirstName: string;
  authorLastName: string;
  title: string;
  bookFullName: string;
  logo?: string;
}

export interface Book {
  bookFullName: string;
  content: string;
}
