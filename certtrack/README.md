# CertTrack - Certificate Tracking System for A Better Way Ministries

Internal vocational training hour tracking for the 14 ABWM certificate programs.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui components
- **Bolt native database** (built-in database, not Supabase)
- Recharts for charts

## The 14 Certificate Programs

| # | Certificate Name | Required Hours |
|---|------------------|----------------|
| 1 | Wood Shop & Commercial Table Production | 900 |
| 2 | Van/Truck Loading & Logistics Operations | 400 |
| 3 | Truck Loading & Commercial Transportation Operations | 990 |
| 4 | Lawn Care & Landscape Operations | 800 |
| 5 | Automotive Technician | 900 |
| 6 | Small Engine Repair & Maintenance | 400 |
| 7 | Retail Operations & Inventory Systems | 500 |
| 8 | Cashiering & Point-of-Sale Operations | 500 |
| 9 | Facilities Maintenance & Property Services | 900 |
| 10 | Food Service & Kitchen Operations | 700 |
| 11 | Moving Operations Dispatch & Customer Service | 800 |
| 12 | Donation Pickup Scheduling & Logistics Coordination | 700 |
| 13 | Media Production & Digital Content Operations | 800 |
| 14 | Christmas Tree & Seasonal Retail Operations | 350 |

## Key Features

### Phase 1 (Current)
- Dashboard with metrics and charts
- Students CRUD with soft delete
- Certificates (14 programs seeded)
- Enrollments tracking (one active per student)
- Time tracking (flexible, not daily)
- Progress calculations (approved + active only)
- Transcript generation (printable)
- Deletion request workflow (Data Entry requests, Admin approves)

### Phase 2
- Document uploads
- Advanced analytics
- PDF export improvements

## Data Rules

1. **Never hard delete** - soft delete or void only
2. **Preserve all history** - audit trail for everything
3. **Approved + active records only** count toward progress
4. **Flexible entry** - staff can enter hours weekly or as needed
5. **Deletion requests** - Data Entry requests, Admin approves/rejects
6. **One active enrollment per student** (unless manually overridden)

## Running

```bash
npm install
npm run dev
```

## User Roles

- **Admin**: Full access, can approve/reject deletion requests, void records
- **Data Entry**: Create/edit students, enrollments, tracked hours; can request deletions but cannot hard delete
