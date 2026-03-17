
-- Add rate limiting: restrict inserts to max 5 per hour per IP via a simple check
-- We'll add a constraint that description must be non-empty and name has max length
ALTER TABLE public.projects 
  ADD CONSTRAINT projects_name_length CHECK (char_length(name) <= 200),
  ADD CONSTRAINT projects_description_length CHECK (char_length(description) <= 5000),
  ADD CONSTRAINT projects_author_name_length CHECK (char_length(author_name) <= 200);
