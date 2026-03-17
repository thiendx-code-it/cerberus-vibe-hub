export interface Project {
  id: string;
  name: string;
  description: string;
  author_name: string;
  author_url: string | null;
  category_slug: string;
  created_at: string;
  has_local_app: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface AppMeta {
  name: string;
  description: string;
  author_name: string;
  author_url?: string | null;
  category_slug: string;
  created_at: string;
}
