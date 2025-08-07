export interface UserInterface {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface PaginatedUserResponseInterface {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserInterface[];
}
