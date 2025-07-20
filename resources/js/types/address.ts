export interface Address {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedAddresses {
  current_page: number;
  data: Address[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
