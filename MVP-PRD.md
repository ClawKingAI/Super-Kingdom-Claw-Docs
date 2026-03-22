# Pocket Prayers MVP - Product Requirements Document

## Problem
People seeking spiritual community lack a simple, trustworthy digital space to share prayers and access quality teachings on intercession. Existing platforms are either too complex, lack proper content gating, or don't foster genuine community connection.

## Target User
**Primary**: Christians (25-55) who want to grow in prayer and intercession, already connected to or curious about the Pocket Prayers community.

**Secondary**: Ministry leaders who want to publish teachings and moderate community content.

## Goals
1. Launch a functional MVP in 4-6 weeks
2. Validate demand for prayer community + premium teachings model
3. Achieve 100+ registered users and 20+ subscribers in first month
4. Establish a clean foundation for future feature expansion

## Non-Goals (V1)
- Comments and reactions
- Push notifications
- Audio/video teachings
- Real-time chat
- Annual subscription plans
- Coupon codes
- Advanced analytics
- Mobile apps (using responsive web)

## Core Features

### Public Features
- Landing page with value proposition
- Preview of recent prayers (limited)
- Preview of teachings (premium locked)
- Authentication (email/password)
- Legal pages (Terms, Privacy)

### Authenticated User Features
- Full profile creation/editing
- Post prayers (anonymous option)
- Browse prayer wall (infinite scroll)
- Access free teachings
- View profile and subscription status

### Subscriber Features
- All authenticated features
- Access premium teachings library
- Locked content unlocks

### Admin Features
- Teachings CRUD (create, edit, delete)
- Publish/unpublish teachings
- Feature teachings on homepage
- Review/hide/delete prayers
- View member list and subscription states

## User Roles

| Role | Permissions |
|------|-------------|
| Guest | View landing, preview content, register/login |
| User | Post prayers, view prayer wall, free teachings |
| Subscriber | All user + premium teachings |
| Admin | All subscriber + teachings management + moderation |

## Success Criteria

### Week 1 Post-Launch
- 50+ registered users
- 25+ prayers posted
- 10+ teachings published
- Stripe checkout working end-to-end

### Month 1 Post-Launch
- 100+ registered users
- 20+ paying subscribers
- 100+ prayers posted
- NPS score > 7
- < 5% churn rate

## Assumptions
- Users will pay $5/month for premium teachings
- Text-only teachings are sufficient for V1
- Auto-publishing prayers with admin moderation is acceptable
- Email/password auth is sufficient (no social login needed)

## Risks
1. **Low conversion rate** - Mitigation: Clear value proposition, preview content
2. **Spam/abuse on prayer wall** - Mitigation: Admin moderation, flagging system
3. **Stripe integration complexity** - Mitigation: Use Supabase Stripe extension
4. **Content velocity** - Mitigation: Pre-populate with 10+ teachings before launch
