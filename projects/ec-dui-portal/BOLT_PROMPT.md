# EC DUI School Client Support Services Portal
## Comprehensive Bolt.new Build Prompt

---

# PROJECT OVERVIEW

Build a complete case management portal for **East Coweta DUI School & Risk Reduction Center, LLC** (short name: EC DUI School). This is a client tracking and communication system for court-ordered programs including FVIP, Anger Management, Risk Reduction, Driver Improvement, Victim Impact Panel, Parenting, Shoplifting, and 420-Marijuana classes.

---

# BUSINESS IDENTITY

**Official Name:** East Coweta DUI School & Risk Reduction Center, LLC
**Short Name:** EC DUI School
**Portal Name:** EC DUI School Client Support Services Portal

**Mission Statement:** "Improving Quality of Life for Individuals & Families"
**Vision Statement:** To become a national model as a preferred school of choice

**Brand Colors:**
- Blue: #1e88e5
- Yellow: #fbc02d
- Green: #43a047
- Orange: #ef6c00

---

# DATABASE SCHEMA

## Table: clients
```sql
- id (UUID, primary key)
- first_name (text)
- last_name (text)
- phone (text)
- email (text)
- program_id (FK → programs)
- start_date (date)
- end_date (date, nullable)
- county_of_referral (text)
- referral_source (enum: Probation, Parole, Pretrial Diversion, Pretrial Intervention, State Court, Superior Court, Accountability Court, DFACS, Attorney, Self-Referred, Other Referral Source, Out-of-State)
- referral_source_other (text, nullable)
- status (enum: active, completed, terminated, transferred)
- created_at (timestamp)
- updated_at (timestamp)
```

## Table: programs
```sql
- id (UUID, primary key)
- name (text): FVIP, Anger Management, Risk Reduction, Driver Improvement, Victim Impact Panel, Parenting, Shoplifting, 420-Marijuana Risk Reduction
- session_count (integer)
- fee (decimal)
- max_absences (integer, default 3)
- max_lates (integer, default 3)
- created_at (timestamp)
```

## Table: attendance
```sql
- id (UUID, primary key)
- client_id (FK → clients)
- session_date (date)
- session_number (integer)
- status (enum: present, late, absent)
- notes (text, nullable)
- marked_by (FK → users)
- created_at (timestamp)
```

## Table: payments
```sql
- id (UUID, primary key)
- client_id (FK → clients)
- amount (decimal)
- payment_method (text)
- authorization_id (text, nullable)
- paid_date (date)
- notes (text, nullable)
- recorded_by (FK → users)
- created_at (timestamp)
```

## Table: documents
```sql
- id (UUID, primary key)
- client_id (FK → clients)
- document_type (enum: registration, contract, certificate, case_plan, other)
- program (text, nullable)
- file_url (text)
- file_name (text)
- uploaded_by (FK → users)
- uploaded_at (timestamp)
- notes (text, nullable)
```

## Table: letters
```sql
- id (UUID, primary key)
- client_id (FK → clients)
- letter_type (enum: completion, termination, transfer)
- program (text)
- generated_at (timestamp)
- generated_by (FK → users)
- content_snapshot (jsonb)
- pdf_url (text)
```

## Table: referral_sources
```sql
- id (UUID, primary key)
- name (text)
- type (enum: Probation, Parole, Court, DFACS, Attorney, Other)
- contact_email (text)
- contact_phone (text, nullable)
- created_at (timestamp)
```

## Table: users
```sql
- id (UUID, primary key, auth.users)
- email (text)
- role (enum: admin, office_assistant, referral_source)
- referral_source_id (FK → referral_sources, nullable)
- created_at (timestamp)
```

## Table: notifications
```sql
- id (UUID, primary key)
- client_id (FK → clients)
- notification_type (enum: enrollment, completion, termination, transfer)
- sent_to (text) -- email address
- sent_at (timestamp)
- status (enum: pending, sent, failed)
```

---

# USER ROLES & PERMISSIONS

## Admin (Business Owner)
- Full access to all features
- Manage all clients, programs, users
- View all reports
- Generate all letters
- Mark attendance
- Record payments
- Configure system settings

## Office Assistant
- Same as Admin (per client request)

## Referral Source (Probation Officers, Courts, etc.)
- View only clients referred by them
- View attendance history (read-only)
- View payment status (read-only)
- Download completion letters
- Upload case management documents
- Receive email notifications

---

# PAGES (11 Total)

## 1. Login Page
- Email/password authentication
- Role-based redirect after login
- Forgot password link

## 2. Dashboard (Admin)
- Stats overview cards:
  - Active clients
  - Clients approaching limits (absence/late warnings)
  - Payments this month
  - Programs completion rate
- Quick actions: Add Client, Mark Attendance, Record Payment
- Recent activity log
- Mission statement displayed: "Improving Quality of Life for Individuals & Families"

## 3. Clients List
- Table view with columns: Name, Program, Status, Start Date, Balance Due
- Search by name, phone, email
- Filter by program, status, referral source
- Sort by any column
- Click row to view client detail
- Add new client button
- Export to CSV button

## 4. Client Detail View
- Header: Name, Program, Status, Contact info
- Tabs:
  1. **Info** — All client fields, edit button
  2. **Attendance** — Calendar view, session list, absence/late counters with alerts
  3. **Payments** — Payment history table, balance calculation, add payment
  4. **Documents** — Uploaded files, HushForms links, upload button
  5. **Letters** — Generated letters, download PDFs, generate new
- Quick actions: Generate Letter, Record Payment, Mark Attendance

## 5. Attendance Page
- Date picker for session date
- Filter by program
- Bulk attendance marking:
  - Select multiple clients
  - Mark all as Present, Late, or Absent
- Visual indicators:
  - Green = present
  - Yellow = late (counter shows)
  - Red = absent (counter shows)
  - Red alert icon when approaching 3 limit
- Session number auto-increment

## 6. Payments Page
- Table: Client, Amount, Date, Method, Balance
- Add payment modal:
  - Amount
  - Payment method (dropdown: Cash, Card, Zelle, Apple Pay, Other)
  - Authorization ID (optional)
  - Paid date
  - Notes
- Balance auto-calculated from program fee - payments
- Search and filter
- Export to CSV

## 7. Documents Page
- Two sections:
  1. **Registration Forms** — HushForms links organized by program:
     - FVIP Registration Form → https://hushforms.com/ecdui-9082
     - FVIP Contract → https://hushforms.com/ecdui-6331
     - FVIP Principles of Practice → https://hushforms.com/ecdui-8550
     - Anger Management Registration → https://hushforms.com/ecdui-883
     - Risk Reduction Registration → https://hushforms.com/ecdui
     - Driver Improvement Registration → https://hushforms.com/ecdui
     - Victim Impact Panel Registration → https://hushforms.com/ecdui
     - Parenting Class Registration → https://hushforms.com/ecdui
     - Shoplifting Class Registration → https://hushforms.com/ecdui
     - 420-Marijuana Risk Reduction → https://hushforms.com/ecdui
  2. **Uploaded Documents** — File list with upload button

## 8. Letters Page
- Letter type selector: Completion, Termination, Transfer
- Program selector (for Completion letters)
- Client selector with auto-fill
- Preview section showing:
  - Start date
  - End date
  - Total days attended
  - Total absences
  - Total payments
  - Balance due
- Generate PDF button
- Download PDF button
- Email to referral source button

## 9. Reports Page
- Report types (dropdown):
  1. Monthly Revenue by Program
  2. Completion Rates by Program
  3. Attendance Compliance
  4. Referral Source Activity
  5. Outstanding Balances
- Date range picker
- Program filter
- Export to CSV/PDF
- Charts/visualizations

## 10. Settings Page
- Programs management (add/edit/deactivate)
- Referral sources management
- User management (add/edit users, assign roles)
- Letter templates configuration
- Email notification settings

## 11. Referral Source Portal
- Filtered dashboard showing only their referred clients
- Client list with status, attendance summary
- Download completion letters
- Upload case management documents
- No access to other clients

---

# CORE FEATURES

## Attendance Tracking
- Session-by-session marking
- Running totals for absences and lates
- Visual alerts:
  - After 1st absence/late: Yellow indicator
  - After 2nd absence/late: Orange indicator
  - At 3rd absence/late: Red alert, notification suggested
- Cannot mark more than 3 of each type without override confirmation

## Payment Recording
- Manual entry (admin/assistant)
- Auto-calculate balance from program fee
- Payment history with running balance
- Receipt generation (print view)

## Letter Generation
- Template-driven PDF generation
- Include all required fields:
  - Client name
  - Program name
  - Start date
  - End date (or "current" for termination)
  - Total sessions
  - Days attended
  - Absences
  - Total paid
  - Balance
- Standard business letterhead (uploaded by client)
- Date format example: "March 1, 2026"

## Email Notifications
Automatic emails sent when:
1. **Client Enrolled** — Notify referral source
2. **Client Completed** — Notify referral source with letter attached
3. **Client Terminated** — Notify referral source
4. **Client Transferred** — Notify both referral sources

Email templates configurable in settings.

---

# UI/UX REQUIREMENTS

## Global Elements
- **Header:** Logo, Portal Name, User menu, Notifications bell
- **Sidebar:** Navigation menu (Dashboard, Clients, Attendance, Payments, Documents, Letters, Reports, Settings)
- **Footer:** Mission statement, "© 2026 EC DUI School"

## Actions on Every Page
- **EMAIL** button — Email current view/data
- **SAVE** button — Save changes
- **PRINT** button — Print-friendly view

## Design Principles
- Clean, professional interface
- Brand colors throughout
- Mobile-responsive
- Accessible (proper contrast, labels)
- Fast loading

---

# INTEGRATION NOTES

## Phase 1 (Build Now)
- Manual payment entry
- HushForms links (not API integration)
- Email notifications via Bolt built-in
- PDF generation via Edge Functions

## Phase 2 (Future)
- QuickBooks sync
- Stripe payment processing
- HushForms API webhook (if available)

## NOT Feasible
- Zelle has no business API
- Apple Pay requires significant setup (defer)

---

# DATA RETENTION

- Completed clients: Keep records for 5 years minimum
- Terminated clients: Keep records for 5 years minimum
- Transferred clients: Keep records for 5 years minimum
- Active clients: No retention limit

---

# SECURITY REQUIREMENTS

## PII Exclusion (DO NOT Collect)
- Date of birth
- Physical address
- Race
- Gender
- Driver's license number
- SSN

## Data Security
- All data encrypted at rest
- HTTPS enforced
- Role-based access control
- Row-level security for referral sources
- Audit log for all operations

---

# SUCCESS CRITERIA

Phase 1 is complete when:
1. Admin can track clients, attendance, payments
2. Letters generate correctly with all required data
3. Referral sources receive notifications (enrollment, completion, termination)
4. Referral sources can view their clients and upload documents
5. All brand colors and identity are applied
6. EMAIL, SAVE, PRINT work on all pages

---

# TECHNICAL NOTES

## Use Bolt Database
- PostgreSQL built-in
- Authentication built-in
- Storage built-in
- Edge Functions for PDF generation

## AI Integration (for Reports/Analytics)
When AI-generated content is needed (summaries, forecasts, report insights), use:
```
OpenAI client with NVIDIA NIM API
base_url: https://integrate.api.nvidia.com/v1
model: z-ai/glm5
API key: [to be provided by client]
```

---

# BEGIN BUILDING

Start with:
1. Project setup with Bolt Database
2. Authentication with roles (admin, referral_source)
3. Database tables as defined above
4. Dashboard page with mission statement
5. Client management (CRUD)
6. Attendance tracking with alerts
7. Payment recording
8. Letter generation
9. Referral source portal
10. Email notifications
11. Reports dashboard

Apply brand colors throughout. Ensure mobile responsive. Test all flows.

---

# REFERENCE LINKS

- HushForms are at: https://hushforms.com/ecdui-XXXX (replace XXXX with form code)
- Architecture Map: https://civic-mudra-pyqv.here.now/
- Working Prototype: https://eager-pulsar-ba7m.here.now/

---

Build this complete system. Ask questions if any requirements need clarification.
