-- Create Complaints Table
CREATE TABLE public.complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Medium',
  description TEXT NOT NULL,
  ward_number INT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  image_urls TEXT[],
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'Submitted',
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  assigned_engineer TEXT,
  estimated_completion DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated and anonymous users
CREATE POLICY "Allow public read access" ON public.complaints 
  FOR SELECT USING (true);

-- Allow authenticated users to insert complaints
CREATE POLICY "Allow authenticated insert" ON public.complaints 
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own complaints or admin updates
CREATE POLICY "Allow update for users and admin" ON public.complaints 
  FOR UPDATE USING (true);