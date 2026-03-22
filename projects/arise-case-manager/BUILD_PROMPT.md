# BUILD PROMPT - Arise Case Manager

Paste this prompt into Bolt.new, z.ai, or any AI coding assistant:

---

## PROMPT START

Build a production-ready case management web application called **Arise Case Manager** for a counseling services center.

### BUSINESS CONTEXT

Arise Counseling Services needs to manage clients across multiple court-ordered and voluntary programs: FVIP (24-week Family Violence Intervention), DUI evaluations/treatment, Level-1 Substance Abuse, Anger Management (10 sessions), IOP (Intensive Outpatient), individual counseling, and psychiatric services. They track client intake, court/probation referrals, session attendance, payments, documents, completion letters, and communicate with probation officers. Must comply with Georgia FVIP reporting requirements (10th-day monthly reports, 4-day referral notification on completion).

### TECH STACK

- Next.js 15 (App Router)
- Supabase (PostgreSQL database, Auth, Storage, Row-Level Security)
- Tailwind CSS
- shadcn/ui components
- TypeScript

### DATABASE SCHEMA

Create these Supabase tables:

```sql
-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE,
  phone VARCHAR(20),
  email VARCHAR(255),
  address_street VARCHAR(255),
  address_city VARCHAR(100),
  address_state VARCHAR(2) DEFAULT 'GA',
  address_zip VARCHAR(10),
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  gender VARCHAR(20),
  race_ethnicity VARCHAR(50),
  marital_status VARCHAR(30),
  employment_status VARCHAR(50),
  primary_language VARCHAR(30) DEFAULT 'English',
  insurance_name VARCHAR(200),
  insurance_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs offered
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL, -- FVIP, DUI_EVAL, DUI_TREATMENT, LEVEL1_SA, ANGER_MGMT, IOP, COUNSELING, PSYCH
  display_name VARCHAR(200) NOT NULL,
  description TEXT,
  is_group_program BOOLEAN DEFAULT true,
  total_sessions INTEGER, -- NULL for open-ended programs
  duration_weeks INTEGER,
  fee_structure JSONB DEFAULT '{}', -- {"orientation": 100, "weekly": 30}
  compliance_reporting BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups (specific class sessions)
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id),
  name VARCHAR(200) NOT NULL, -- "Men's FVIP Tuesday"
  day_of_week VARCHAR(10), -- Monday, Tuesday, etc.
  start_time TIME,
  end_time TIME,
  facilitator_id UUID REFERENCES staff(id),
  location VARCHAR(200) DEFAULT 'Online',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL, -- admin, facilitator, office_staff, psychiatrist, nurse_practitioner
  credentials VARCHAR(200), -- CACII, MAC, CCS, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments (client in a program)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) NOT NULL,
  program_id UUID REFERENCES programs(id) NOT NULL,
  group_id UUID REFERENCES groups(id),
  referral_source VARCHAR(200), -- Court name, attorney, self
  referral_type VARCHAR(50), -- court_ordered, probation, voluntary, attorney
  court_name VARCHAR(200),
  case_number VARCHAR(100),
  charge_offense VARCHAR(200),
  enrollment_date DATE,
  orientation_date DATE,
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- pending_orientation, active, completed, terminated, transferred, hold
  termination_reason TEXT,
  transfer_destination VARCHAR(200),
  fee_plan JSONB DEFAULT '{}',
  balance_due DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Probation officers directory
CREATE TABLE probation_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  agency VARCHAR(200),
  email VARCHAR(255),
  phone VARCHAR(20),
  fax VARCHAR(20),
  office_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link enrollments to probation officers
CREATE TABLE probation_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id),
  officer_id UUID REFERENCES probation_officers(id),
  supervision_type VARCHAR(50), -- probation, parole, pretrial, none
  referral_date DATE,
  reporting_frequency VARCHAR(50),
  special_conditions TEXT,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id),
  session_date DATE NOT NULL,
  session_number INTEGER, -- Week 1, Week 2, etc.
  facilitator_id UUID REFERENCES staff(id),
  topic VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id),
  session_id UUID REFERENCES sessions(id),
  status VARCHAR(20) NOT NULL, -- present, absent, excused, late
  check_in_time TIME,
  minutes_late INTEGER DEFAULT 0,
  notes TEXT,
  recorded_by UUID REFERENCES staff(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment records
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  enrollment_id UUID REFERENCES enrollments(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50), -- cash, card, money_order, check, insurance
  receipt_number VARCHAR(50),
  receipt_url VARCHAR(500), -- Supabase storage path
  balance_after DECIMAL(10,2),
  notes TEXT,
  recorded_by UUID REFERENCES staff(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document uploads
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  enrollment_id UUID REFERENCES enrollments(id),
  document_type VARCHAR(50) NOT NULL, -- court_order, intake_form, contract, assessment, id, completion_letter, termination_letter, etc.
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL, -- Supabase storage path
  file_size INTEGER,
  uploaded_by UUID REFERENCES staff(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  is_visible_to_officer BOOLEAN DEFAULT false,
  notes TEXT
);

-- Generated letters
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id),
  letter_type VARCHAR(50) NOT NULL, -- completion, termination, transfer, progress
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by UUID REFERENCES staff(id),
  pdf_path VARCHAR(500),
  emailed_to VARCHAR(255),
  email_sent_at TIMESTAMPTZ,
  faxed_to VARCHAR(20),
  fax_sent_at TIMESTAMPTZ
);

-- Audit trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  client_id UUID REFERENCES clients(id),
  action VARCHAR(100) NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### AUTHENTICATION & ROW LEVEL SECURITY

Set up Supabase Auth with these roles:
- `admin` - Full access to everything
- `staff` - Create/edit clients, payments, documents, letters
- `facilitator` - Record attendance, view clients in their groups
- `probation_officer` - View-only access to their assigned clients

Create RLS policies so probation officers can only see clients where they are assigned via probation_assignments.

### APP ROUTER STRUCTURE

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── reset-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx (sidebar, top nav)
│   ├── page.tsx (admin dashboard with stats)
│   ├── clients/
│   │   ├── page.tsx (client list)
│   │   ├── new/page.tsx (intake form)
│   │   └── [id]/
│   │       ├── page.tsx (client detail overview)
│   │       ├── attendance/page.tsx
│   │       ├── payments/page.tsx
│   │       ├── documents/page.tsx
│   │       └── letters/page.tsx
│   ├── attendance/
│   │   └── page.tsx (today's sessions, mark attendance)
│   ├── payments/
│   │   └── page.tsx (payment entry)
│   ├── documents/
│   │   └── page.tsx (document library)
│   ├── letters/
│   │   └── page.tsx (generate and send letters)
│   ├── reports/
│   │   └── page.tsx (reports dashboard)
│   └── settings/
│       ├── programs/page.tsx
│       ├── staff/page.tsx
│       └── officers/page.tsx
├── (portal)/
│   └── officer/
│       ├── login/page.tsx
│       └── clients/
│           ├── page.tsx (list of assigned clients)
│           └── [id]/page.tsx (view-only client detail)
└── api/
    └── [...]/ (API routes if needed)
```

### KEY PAGES TO BUILD

#### 1. Admin Dashboard (`app/(dashboard)/page.tsx`)
Cards showing: Active clients count, Today's sessions, Outstanding balances, Alerts (missing documents, overdue payments, compliance deadlines). Recent activity feed. Quick actions.

#### 2. Client List (`app/(dashboard)/clients/page.tsx`)
Table with: Name, Program, Status, PO, Balance. Search by name/case number. Filters: program, status, probation officer. Click row to go to detail. "New Client" button.

#### 3. Client Intake (`app/(dashboard)/clients/new/page.tsx`)
Multi-step form: Demographics → Address → Emergency Contact → Insurance → Referral Info (court, case number, PO) → Program Enrollment → Document Upload. Save draft. Submit creates client + enrollment.

#### 4. Client Detail (`app/(dashboard)/clients/[id]/page.tsx`)
Header: Name, status badge, program, PO info, balance. Tabs: Overview (summary cards), Enrollments (program history), Attendance (table with running totals), Payments (history + entry form), Documents (upload + list), Letters (generate + history). Action buttons: Record Payment, Upload Document, Generate Letter, Email Packet.

#### 5. Attendance Page (`app/(dashboard)/attendance/page.tsx`)
Select date and group. Shows list of enrolled clients for that group. For each: checkboxes for Present/Absent/Late/Excused. Notes field. Save button. Auto-calculates attendance percentage per client.

#### 6. Payment Entry (`app/(dashboard)/payments/page.tsx`)
Form: Select client (searchable dropdown), enrollment, amount, date, method, receipt upload (image/PDF), notes. Shows current balance. After save, shows new balance.

#### 7. Letters Page (`app/(dashboard)/letters/page.tsx`)
Select client + enrollment. Select letter type (completion, termination, transfer). Preview. Generate PDF. Email to PO (shows PO email). Download. Log of past letters sent.

#### 8. Probation Officer Portal (`app/(portal)/officer/clients/page.tsx`)
Simple login for POs. List of their assigned clients with status and program. Click to view detail (read-only): attendance summary, payment history, downloadable letters.

### CORE COMPONENTS

Use shadcn/ui for:
- Data tables (sortable, filterable, pagination)
- Forms (react-hook-form + zod validation)
- Dialogs/Modals
- Toast notifications
- Cards
- Tabs
- Buttons, inputs, selects

### API INTEGRATION

Use Supabase client (`@supabase/supabase-js`):
- `supabase.auth` for login/logout/session
- `supabase.from('clients').select()` etc for CRUD
- `supabase.storage.from('documents').upload()` for file uploads
- Real-time subscriptions for attendance updates (optional)

### SPECIFIC FEATURES

**Auto-calculations:**
- Expected completion date = start_date + program.duration_weeks weeks
- Attendance percentage = (present sessions / total sessions) * 100
- Balance after payment = previous balance - payment amount

**Compliance alerts (FVIP):**
- On 5th of month: alert "Monthly report due by 10th"
- On completion status change: alert "Notify referral source within 4 business days"
- If missing court_order or contract documents: show warning banner

**Letter generation:**
Use @react-pdf/renderer or similar. Template includes: client name, DOB, case number, program name, start date, completion date, total sessions attended, attendance percentage, facilitator signature line.

**Email packet:**
Button on client detail: "Email Case Packet to PO". Compiles into single PDF: cover sheet + client info + attendance summary + payment history + completion letter + selected documents. Uses Resend or Supabase Edge Functions for email.

### SEED DATA

After building, insert seed data:
- 3 programs (FVIP, DUI_EVAL, ANGER_MGMT)
- 2 groups (Men's FVIP Tuesday, Anger Management Thursday)
- 2 staff (1 admin, 1 facilitator)
- 2 probation officers (different counties)
- 5 clients with enrollments
- Sample attendance records
- Sample payments

### DESIGN

- Dark theme with blue accents (slate-900 background, blue-600 primary)
- Clean, professional, court-appropriate aesthetic
- Card-based layouts with subtle borders
- Responsive (works on tablet)
- Consistent spacing (Tailwind defaults)
- Clear typography (Inter font)

### IMPLEMENTATION ORDER

1. Set up Next.js project with Supabase
2. Create database schema in Supabase
3. Configure Auth + RLS
4. Build login page
5. Build dashboard layout (sidebar, top nav)
6. Build client list + intake form
7. Build client detail page (all tabs)
8. Build attendance page
9. Build payment entry
10. Build document upload
11. Build letter generation
12. Build PO portal
13. Build reports
14. Add compliance alerts
15. Add seed data

### DELIVERABLE

A fully functional case management app where:
- Staff can complete client intake in under 5 minutes
- Attendance can be recorded in under 30 seconds per group
- Completion letters can be generated and emailed in under 2 minutes
- Probation officers can self-serve for status checks
- All sensitive actions are audit-logged
- FVIP compliance deadlines are never missed

Build this step by step, testing each feature before moving to the next. Use TypeScript throughout. Handle errors gracefully. Ensure mobile-responsive where applicable.

---

## PROMPT END

This is a complete build prompt. Start implementation now.
