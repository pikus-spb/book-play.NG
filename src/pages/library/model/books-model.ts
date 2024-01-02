export interface BookDescription {
  id: number;
  authorFirstName: string;
  authorLastName: string;
  title: string;
  bookFullName: string;
}

export interface Book {
  bookFullName: string;
  content: string;
}
