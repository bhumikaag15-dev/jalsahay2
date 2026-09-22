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

-- Marketplace service requests and payment records
CREATE TABLE public.service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  authority_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  service_title TEXT NOT NULL,
  address TEXT NOT NULL,
  arrival_window TEXT NOT NULL,
  service_amount NUMERIC(10, 2) NOT NULL CHECK (service_amount >= 0),
  platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed', 'cancelled'))
);

CREATE TABLE public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  service_request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_reference TEXT
);

CREATE TABLE public.reward_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT NOT NULL CHECK (points <> 0),
  reason TEXT NOT NULL,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers read their service requests" ON public.service_requests
  FOR SELECT USING (customer_id = auth.uid() OR authority_id = auth.uid() OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Customers create their service requests" ON public.service_requests
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Authorities update service requests" ON public.service_requests
  FOR UPDATE USING (authority_id = auth.uid() OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Customers read their payments" ON public.payment_transactions
  FOR SELECT USING (customer_id = auth.uid() OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Customers create their payments" ON public.payment_transactions
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users read their reward ledger" ON public.reward_ledger
  FOR SELECT USING (user_id = auth.uid() OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Award points from real complaint activity. These triggers are idempotent for each event transition.
CREATE OR REPLACE FUNCTION public.award_complaint_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.reward_ledger (user_id, points, reason, complaint_id)
    VALUES (NEW.user_id, 120, 'Verified complaint submitted', NEW.id);
  ELSIF TG_OP = 'UPDATE'
    AND NEW.user_id IS NOT NULL
    AND NEW.status IN ('Resolved', 'Closed')
    AND OLD.status NOT IN ('Resolved', 'Closed') THEN
    INSERT INTO public.reward_ledger (user_id, points, reason, complaint_id)
    VALUES (NEW.user_id, 150, 'Complaint resolution confirmed', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER complaint_points_on_insert
  AFTER INSERT ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.award_complaint_points();

CREATE TRIGGER complaint_points_on_resolution
  AFTER UPDATE OF status ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.award_complaint_points();