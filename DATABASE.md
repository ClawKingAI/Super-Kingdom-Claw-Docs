# Pocket Prayers - Supabase Database Plan

## SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'subscriber', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Prayer Warrior'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PRAYERS
-- ============================================
CREATE TABLE prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEACHINGS
-- ============================================
CREATE TABLE teachings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  featured_image_url TEXT,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate slug on insert
CREATE OR REPLACE FUNCTION generate_teaching_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;
  NEW.published_at := CASE WHEN NEW.is_published THEN NOW() ELSE NULL END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_teaching_insert
  BEFORE INSERT ON teachings
  FOR EACH ROW EXECUTE FUNCTION generate_teaching_slug();

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'past_due', 'canceled')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- REPORTS
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id UUID NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- UPDATED AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prayers_updated_at
  BEFORE UPDATE ON prayers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER teachings_updated_at
  BEFORE UPDATE ON teachings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## Relationships

```
profiles (1) ←→ (many) prayers
  - A user can post many prayers
  - Each prayer belongs to one user

profiles (1) ←→ (one) subscriptions
  - A user has one subscription record
  - Subscription tracks Stripe data

profiles (1) ←→ (many) reports
  - A user can report many prayers
  - Used for moderation

profiles (1) ←→ (many) teachings (created_by)
  - Admins create teachings
  - Tracks who created each teaching

prayers (1) ←→ (many) reports
  - A prayer can have many reports
  - Admin reviews reports
```

## Recommended Indexes

```sql
-- Prayers: faster wall queries
CREATE INDEX idx_prayers_status_created ON prayers(status, created_at DESC) 
  WHERE status = 'published';

CREATE INDEX idx_prayers_user ON prayers(user_id);

-- Teachings: faster listing
CREATE INDEX idx_teachings_published ON teachings(is_published, published_at DESC) 
  WHERE is_published = true;

CREATE INDEX idx_teachings_premium ON teachings(is_premium) 
  WHERE is_published = true;

CREATE INDEX idx_teachings_slug ON teachings(slug);

-- Subscriptions: Stripe webhook lookups
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);

-- Reports: moderation queue
CREATE INDEX idx_reports_status ON reports(status) 
  WHERE status = 'pending';

-- Profiles: role-based queries
CREATE INDEX idx_profiles_role ON profiles(role);
```

## Row-Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES RLS
-- ============================================
-- Users can read their own profile
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles_admin_read" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PRAYERS RLS
-- ============================================
-- Published prayers visible to all authenticated users
CREATE POLICY "prayers_published_read" ON prayers
  FOR SELECT USING (
    status = 'published' 
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can insert their own prayers
CREATE POLICY "prayers_self_insert" ON prayers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own prayers (within 1 hour)
CREATE POLICY "prayers_self_update" ON prayers
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND created_at > NOW() - INTERVAL '1 hour'
  );

-- Admins can update any prayer (moderation)
CREATE POLICY "prayers_admin_update" ON prayers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TEACHINGS RLS
-- ============================================
-- Published teachings visible based on premium status
CREATE POLICY "teachings_read" ON teachings
  FOR SELECT USING (
    is_published = true 
    AND (
      is_premium = false 
      OR EXISTS (
        SELECT 1 FROM profiles p
        JOIN subscriptions s ON s.user_id = p.id
        WHERE p.id = auth.uid() 
        AND p.role IN ('subscriber', 'admin')
        AND s.status = 'active'
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- Admins can insert teachings
CREATE POLICY "teachings_admin_insert" ON teachings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update teachings
CREATE POLICY "teachings_admin_update" ON teachings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete teachings
CREATE POLICY "teachings_admin_delete" ON teachings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- SUBSCRIPTIONS RLS
-- ============================================
-- Users can read their own subscription
CREATE POLICY "subscriptions_self_read" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- System inserts subscription (via Stripe webhook service role)
-- No direct user insert

-- Users cannot update subscriptions directly (webhook handles this)

-- ============================================
-- REPORTS RLS
-- ============================================
-- Users can insert reports
CREATE POLICY "reports_insert" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Admins can read all reports
CREATE POLICY "reports_admin_read" ON reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update reports
CREATE POLICY "reports_admin_update" ON reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

## Initial Admin Seed

```sql
-- Create admin user (run after first signup)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Migration Order

1. Enable UUID extension
2. Create profiles table + trigger
3. Create prayers table
4. Create teachings table + trigger
5. Create subscriptions table
6. Create reports table
7. Create updated_at triggers
8. Create indexes
9. Enable RLS + create policies
