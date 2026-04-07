# Kingdom Claw Roadmap

## Recent Additions

### 2026-04-06: Claude Code Best Practices Integration

**Status:** ✅ Complete

**What was added:**
- 36 skills enhanced with standardized frontmatter
- Orchestration workflow patterns documented
- Hooks system design (enhancement layer)
- Memory scopes formalized
- Batch enhancement script

**Files:**
- `integration/CLAUDE-CODE-PATTERNS.md` — Full integration documentation
- `integration/HOOKS-ENHANCEMENT.md` — Hooks system design
- `integration/ORCHESTRATION-PATTERNS.md` — Workflow patterns

---

# Pocket Prayers - Build Roadmap

## Phase 1: App Scaffold + Design System
**Objective**: Establish the project foundation with proper tooling and styling.

### Tasks
- [ ] Initialize Next.js 14 with App Router
- [ ] Configure TypeScript (strict mode)
- [ ] Install and configure Tailwind CSS
- [ ] Install shadcn/ui components
- [ ] Set up Supabase client configuration
- [ ] Create base layout components (Header, Footer, AppNav)
- [ ] Define color palette and typography scale
- [ ] Create reusable UI components (Button, Card, Input, etc.)

### Dependencies
- Node.js 18+
- Supabase project created

### Done Criteria
- `npm run dev` starts the app
- Tailwind classes work
- shadcn/ui components render
- Basic layout shell exists

---

## Phase 2: Auth + Profile
**Objective**: Enable user registration, login, and profile management.

### Tasks
- [ ] Configure Supabase Auth helpers
- [ ] Create `/login`, `/register`, `/forgot-password` pages
- [ ] Implement auth forms with validation
- [ ] Create auth middleware for route protection
- [ ] Build `/app/profile` page
- [ ] Implement profile edit functionality
- [ ] Add avatar upload (Supabase Storage)
- [ ] Handle auth state persistence

### Dependencies
- Phase 1 complete
- Supabase Auth enabled

### Done Criteria
- User can register with email/password
- User can log in and out
- Protected routes redirect to login
- User can edit their profile

---

## Phase 3: Prayer Wall + Post Prayer
**Objective**: Enable community prayer sharing and browsing.

### Tasks
- [ ] Create `/app/prayers` page with infinite scroll
- [ ] Build PrayerCard component
- [ ] Implement prayer list query with pagination
- [ ] Create `/app/prayers/new` page
- [ ] Build PostPrayerForm component
- [ ] Add anonymous posting option
- [ ] Implement prayer creation server action
- [ ] Add success/error toasts

### Dependencies
- Phase 2 complete
- `prayers` table created

### Done Criteria
- User can browse prayer wall
- Prayer wall loads more on scroll
- User can post a prayer
- Anonymous prayers display correctly

---

## Phase 4: Teachings + Premium Gating
**Objective**: Publish teachings with premium content protection.

### Tasks
- [ ] Create `/app/teachings` page
- [ ] Build TeachingCard and TeachingGrid components
- [ ] Implement teachings list query
- [ ] Create `/app/teachings/[slug]` page
- [ ] Build LockedTeachingCard for non-subscribers
- [ ] Implement premium content check (client + server)
- [ ] Add "Subscribe to Unlock" CTA
- [ ] Feature teachings on homepage

### Dependencies
- Phase 3 complete
- `teachings` table created
- Sample teachings seeded

### Done Criteria
- User can browse teachings
- Free teachings are accessible
- Premium teachings show locked state
- CTA redirects to subscription flow

---

## Phase 5: Stripe Subscriptions
**Objective**: Enable paid subscriptions for premium access.

### Tasks
- [ ] Create Stripe product and price
- [ ] Configure Stripe SDK
- [ ] Build PricingCard component
- [ ] Implement checkout session creation
- [ ] Create webhook endpoint `/api/webhooks/stripe`
- [ ] Handle all webhook events
- [ ] Update subscription table on events
- [ ] Update profile role on subscription
- [ ] Test with Stripe CLI
- [ ] Build subscription status component

### Dependencies
- Phase 4 complete
- Stripe account created
- `subscriptions` table created

### Done Criteria
- User can click "Subscribe" and pay
- Payment succeeds and updates database
- Premium content unlocks immediately
- Subscription status displays correctly

---

## Phase 6: Admin Dashboard + Moderation
**Objective**: Enable admins to manage content and users.

### Tasks
- [ ] Create `/admin` layout with navigation
- [ ] Build admin dashboard with stats
- [ ] Create `/admin/teachings` list page
- [ ] Build teachings CRUD forms
- [ ] Implement teaching create/edit/delete actions
- [ ] Create `/admin/prayers` moderation page
- [ ] Build prayer moderation controls (hide/delete)
- [ ] Create `/admin/members` page
- [ ] Implement member search and filter
- [ ] Add admin role check middleware

### Dependencies
- Phase 5 complete
- Admin user seeded

### Done Criteria
- Admin can log in and see dashboard
- Admin can create/edit/delete teachings
- Admin can moderate prayers
- Admin can view members

---

## Phase 7: QA + Deployment
**Objective**: Test thoroughly and launch to production.

### Tasks
- [ ] Write E2E tests for critical paths
- [ ] Test all auth flows
- [ ] Test subscription flow (use Stripe test mode)
- [ ] Test premium content gating
- [ ] Test admin functions
- [ ] Run Lighthouse audit
- [ ] Fix responsive design issues
- [ ] Configure Vercel project
- [ ] Set environment variables
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Test production webhook endpoint
- [ ] Create legal pages (Terms, Privacy)
- [ ] Pre-seed teachings content
- [ ] Launch announcement

### Dependencies
- All phases complete

### Done Criteria
- All tests pass
- Production deployment successful
- Webhook receives events
- First real user can register

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Phase 1 | 2 days |
| Phase 2 | 3 days |
| Phase 3 | 3 days |
| Phase 4 | 3 days |
| Phase 5 | 4 days |
| Phase 6 | 4 days |
| Phase 7 | 3 days |
| **Total** | **~22 days** |

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Stripe integration delay | Use Supabase Stripe extension |
| RLS policy issues | Test thoroughly with different roles |
| Webhook not receiving | Use Stripe CLI for local testing |
| Slow page loads | Implement pagination, use React Query |
