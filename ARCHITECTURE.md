# Pocket Prayers - App Architecture

## Route Structure

```
/                           # Public landing page
/login                      # Authentication
/register                   # Create account
/forgot-password            # Password recovery
/terms                      # Terms of service
/privacy                    # Privacy policy

/app                        # Authenticated app shell
/app/home                   # Dashboard with prayers + teachings
/app/prayers                # Prayer wall feed
/app/prayers/new            # Post a prayer
/app/teachings              # Teachings library
/app/teachings/[slug]       # Single teaching detail
/app/profile                # User profile + subscription

/admin                      # Admin dashboard (protected)
/admin/teachings            # Manage teachings
/admin/teachings/new        # Create teaching
/admin/teachings/[id]/edit  # Edit teaching
/admin/prayers              # Review/moderate prayers
/admin/members              # Member list
```

## Component Structure

```
components/
├── ui/                     # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AppNav.tsx
│   └── AdminNav.tsx
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── PasswordResetForm.tsx
├── prayers/
│   ├── PrayerCard.tsx
│   ├── PrayerWall.tsx
│   ├── PostPrayerForm.tsx
│   └── PrayerModerationCard.tsx
├── teachings/
│   ├── TeachingCard.tsx
│   ├── TeachingGrid.tsx
│   ├── TeachingDetail.tsx
│   ├── LockedTeachingCard.tsx
│   └── TeachingForm.tsx
├── subscription/
│   ├── PricingCard.tsx
│   └── SubscriptionStatus.tsx
└── admin/
    ├── DashboardStats.tsx
    ├── TeachingsTable.tsx
    ├── PrayersTable.tsx
    └── MembersTable.tsx
```

## Data Flow

### Authentication Flow
```
User → LoginForm → Supabase Auth → Session Created
                                    ↓
                            Profile Created (trigger)
                                    ↓
                            Role Assigned (default: user)
                                    ↓
                            Redirect to /app/home
```

### Prayer Posting Flow
```
User → PostPrayerForm → Validate → Supabase Insert
                                           ↓
                                    Prayer Created (status: published)
                                           ↓
                                    Redirect to Prayer Wall
```

### Subscription Flow
```
User → PricingCard → Stripe Checkout → Payment Success
                                           ↓
                                    Webhook received
                                           ↓
                                    Update subscription table
                                           ↓
                                    Update profile.role to 'subscriber'
                                           ↓
                                    Premium content unlocked
```

## Auth Flow

### Middleware Protection
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Public routes - no auth required
  if (['/', '/login', '/register', '/terms', '/privacy'].includes(pathname)) {
    return NextResponse.next()
  }
  
  // App routes - require auth
  if (pathname.startsWith('/app')) {
    const session = await getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  // Admin routes - require admin role
  if (pathname.startsWith('/admin')) {
    const session = await getSession()
    const profile = await getProfile(session.user.id)
    if (profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/app/home', req.url))
    }
  }
  
  return NextResponse.next()
}
```

## Premium Access Flow

### Client-Side Check
```typescript
// components/teachings/LockedTeachingCard.tsx
export function LockedTeachingCard({ teaching }: { teaching: Teaching }) {
  const { profile } = useProfile()
  
  if (teaching.is_premium && profile?.role !== 'subscriber') {
    return <LockedPreview teaching={teaching} />
  }
  
  return <TeachingDetail teaching={teaching} />
}
```

### Server-Side Check (RLS)
```sql
-- Row Level Security on teachings table
CREATE POLICY "teachings_select_policy" ON teachings
  FOR SELECT USING (
    is_published = true 
    AND (
      is_premium = false 
      OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('subscriber', 'admin')
      )
    )
  );
```

## Admin Access Flow

### Role Check
```typescript
// lib/auth.ts
export async function requireAdmin() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  
  const profile = await getProfile(session.user.id)
  if (profile.role !== 'admin') throw new Error('Forbidden')
  
  return { session, profile }
}
```

### Admin Actions
```typescript
// app/admin/teachings/actions.ts
export async function createTeaching(data: TeachingFormData) {
  await requireAdmin()
  // ... create teaching
}

export async function deletePrayer(prayerId: string) {
  await requireAdmin()
  // ... soft delete or update status to 'hidden'
}
```

## State Management

### Server State (React Query / SWR)
- Prayers list (infinite scroll)
- Teachings list
- Profile data
- Subscription status

### Client State (React Context)
- Auth session
- UI state (modals, forms)
- Toast notifications

## API Structure

### Server Actions (Next.js)
- `/actions/auth.ts` - Login, register, logout
- `/actions/prayers.ts` - CRUD for prayers
- `/actions/teachings.ts` - CRUD for teachings
- `/actions/subscription.ts` - Stripe operations
- `/actions/admin.ts` - Admin-only operations

### Supabase Client
- `@supabase/auth-helpers-nextjs` for SSR auth
- `@supabase/supabase-js` for client operations
