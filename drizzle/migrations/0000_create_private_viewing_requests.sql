CREATE TABLE public.viewing_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 first_name text NOT NULL CHECK (length(first_name) BETWEEN 1 AND 100),
 last_name text NOT NULL CHECK (length(last_name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (length(email) <= 254 AND email LIKE '%@%.%'),
 phone text NOT NULL CHECK (length(phone) BETWEEN 5 AND 40),
 country text NOT NULL CHECK (length(country) BETWEEN 2 AND 100),
 reference text NOT NULL DEFAULT 'BU200.40.AA.AA.C' CHECK (reference = 'BU200.40.AA.AA.C')
);
GRANT INSERT ON public.viewing_requests TO anon, authenticated;
GRANT ALL ON public.viewing_requests TO service_role;
ALTER TABLE public.viewing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can request a private viewing" ON public.viewing_requests FOR INSERT TO anon, authenticated WITH CHECK (reference = 'BU200.40.AA.AA.C');