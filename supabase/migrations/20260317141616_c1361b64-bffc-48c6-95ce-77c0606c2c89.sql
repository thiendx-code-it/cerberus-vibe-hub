
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '📁',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  demo_url TEXT,
  source_url TEXT,
  category_slug TEXT NOT NULL REFERENCES public.categories(slug),
  author_name TEXT NOT NULL,
  author_url TEXT,
  thumbnail_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Projects: public read only approved
CREATE POLICY "Approved projects are viewable by everyone" ON public.projects FOR SELECT USING (is_approved = true);

-- Projects: anyone can submit (insert)
CREATE POLICY "Anyone can submit a project" ON public.projects FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_projects_category ON public.projects(category_slug);
CREATE INDEX idx_projects_approved ON public.projects(is_approved);
CREATE INDEX idx_projects_created ON public.projects(created_at DESC);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories
INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
  ('Game', 'game', '🎮', 1),
  ('Giải trí', 'giai-tri', '🎬', 2),
  ('Công cụ', 'cong-cu', '🔧', 3),
  ('Học tập & Năng suất', 'hoc-tap', '📚', 4),
  ('Tâm linh', 'tam-linh', '🔮', 5),
  ('Sáng tạo & Nghệ thuật', 'sang-tao', '🎨', 6),
  ('Xã hội & Kết nối', 'xa-hoi', '🤝', 7),
  ('Sức khỏe & Lối sống', 'suc-khoe', '💪', 8),
  ('Tài chính', 'tai-chinh', '💰', 9),
  ('Khác', 'khac', '📦', 10);
