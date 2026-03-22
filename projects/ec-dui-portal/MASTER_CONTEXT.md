# EC DUI SCHOOL CLIENT SUPPORT SERVICES PORTAL
## Master Context Document for AI Build Prompt Generation

**Last Updated:** 2026-03-18
**Status:** Awaiting client feedback on clarifying questions

---

## CLIENT INFORMATION

- **Business Name:** East Coweta DUI School & Risk Reduction Center, LLC
- **Short Name:** EC DUI School
- **Portal Name:** EC DUI School Client Support Services Portal
- **Client Contact:** Business owner (name TBD)
- **Developer:** David Morgan

---

## MISSION & VISION

- **Mission:** "Improving Quality of Life for Individuals & Families"
- **Vision:** To become a national model as a preferred school of choice

---

## BRANDING

- **Official Colors:** Blue, Yellow, Green, Orange
- **Logo:** TBD (request PNG/SVG from client)
- **Hex Codes:** TBD (request from client)

---

## USER ROLES

### 1. Admin (Business Owner)
- Full access to all features
- Manage all clients, programs, users
- View all reports and analytics
- Generate letters
- Mark attendance
- Record payments

### 2. Probation Officer (Referral Source)
- Limited view — only their referred clients
- View attendance history
- View payment status
- Download completion letters
- Upload case management documents
- Receive email notifications when client completes/terminates

---

## PROGRAMS OFFERED

| Program | Type | Notes |
|---------|------|-------|
| FVIP (Family Violence Intervention Program) | Court-ordered | Tutorial video needed for contract & principles |
| Anger Management | Court-ordered | Completion letter required |
| Risk Reduction Class | DUI school | Certificate of completion |
| Driver Improvement | Traffic school | Certificate of completion |
| Victim Impact Panel | Court-ordered | Completion letter required |
| Parenting Class | Court-ordered | Completion letter required |
| Shoplifting Class | Court-ordered | Completion letter required |
| 420-Marijuana Risk Reduction | Specialty class | Certificate of completion |

---

## REGISTRATION FORMS (HushForms)

| Program | Form URL |
|---------|----------|
| FVIP Registration | https://hushforms.com/ecdui-9082 |
| FVIP Contract | https://hushforms.com/ecdui-6331 |
| FVIP Principles of Practice | https://hushforms.com/ecdui-8550 |
| Anger Management Registration | https://hushforms.com/ecdui-883 |
| Risk Reduction Class Registration | https://hushforms.com/ecdui |
| Driver Improvement Registration | https://hushforms.com/ecdui |
| Victim Impact Panel Registration | https://hushforms.com/ecdui |
| Parenting Class Registration | https://hushforms.com/ecdui |
| Shoplifting Class Registration | https://hushforms.com/ecdui |
| 420-Marijuana Risk Reduction | https://hushforms.com/ecdui |

**Integration Status:** TBD (ask if HushForms has API/webhook access)

---

## REFERRAL SOURCES

Dropdown options for client intake:
- Probation
- Parole
- Pretrial Diversion
- Pretrial Intervention
- State Court
- Superior Court
- Accountability Court
- DFACS
- Attorney
- Self-Referred
- Other Referral Source
- Out-of-State

---

## ATTENDANCE TRACKING

- **Limits:** 3 absences maximum, 3 lates maximum per program
- **Workflow:** TBD (ask client)
  - How often is attendance marked? (daily, weekly, per session?)
  - Who marks attendance? (owner only, or instructors too?)
  - Alert actions when approaching limits? (notification, report, flag?)

---

## PAYMENTS & INTEGRATIONS

### Stripe
- **Status:** Confirmed — Stripe is the payment processor
- **Integration:** Auto-record payments via Stripe webhooks
- **Manual Entry:** Needed for cash, money orders, in-person payments
- **Payment Data Captured:**
  - Amount
  - Customer name & email
  - Paid date
  - Payment method (last 4 digits)
  - Authorization ID
  - Linked to client record

### QuickBooks
- **Status:** Requested by client
- **Integration:** Via Bolt (AI coding tool that integrates Stripe + QuickBooks)
- **Purpose:** Export payments for accounting

---

## LETTER GENERATION

### Letter Types:
1. **Completion Letter** — For: FVIP, Anger Management, Victim Impact Panel, Parenting, Shoplifting
   - Start date
   - End date
   - Total days attended
   - Total absences
   - Money paid
   - Balance

2. **Letter of Termination**

3. **Letter of Transfer**

### TBD:
- Existing letterhead/templates? (request from client)
- Standard format for court acceptance? (ask client)
- Digital signatures needed? (ask client)

---

## DOCUMENT MANAGEMENT

### Attachment Upload Section
- Two-way document sharing
- Referral sources upload: case management plans, other documents
- Business uploads: certificates of completion (Risk Reduction, Driver Improvement, 420-Marijuana)

### PII Exclusion (CRITICAL)
**DO NOT store:**
- Date of birth
- Physical address
- Race
- Gender
- Driver's license number
- SSN

---

## REPORTING & ANALYTICS

**Requested:** Statistics, analytics, forecasting

**TBD — Ask client:**
- Top 5 must-have reports? (e.g., monthly revenue by program, completion rates, outstanding balances, attendance compliance, referral source activity)
- What "forecasting" metrics matter? (projected revenue, expected completions, capacity planning?)

---

## ARCHITECTURE DECISIONS

### Frontend
- **Framework:** React + TailwindCSS + Vite
- **Hosting:** Vercel or Netlify

### Backend
- **Platform:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Why:** All-in-one, row-level security for probation officer filtering

### Database Tables (Draft)
```
clients
├── id (UUID)
├── name
├── phone
├── email
├── program_id (FK)
├── start_date
├── end_date
├── county_of_referral
├── referral_source_id (FK)
├── referral_source_other
├── status (active/completed/terminated/transferred)
├── created_at
└── updated_at

attendance
├── id
├── client_id (FK)
├── date
├── status (present/late/absent)
├── notes
└── created_at

payments
├── id
├── client_id (FK)
├── amount
├── payment_method
├── authorization_id
├── paid_date
├── customer_email
└── created_at

documents
├── id
├── client_id (FK)
├── type (registration/contract/certificate/other)
├── program
├── file_url
├── uploaded_by
├── uploaded_at
└── notes

letters
├── id
├── client_id (FK)
├── type (completion/termination/transfer)
├── program
├── generated_at
├── content_snapshot
└── pdf_url

programs
├── id
├── name
├── requirements
├── session_count
├── fee
└── letter_template

referral_sources
├── id
├── name
├── type
├── contact_email
└── created_at

users
├── id
├── email
├── role (admin/referral_source)
├── referral_source_id (FK, nullable)
└── created_at
```

---

## PAGES (11 Total)

| Page | Description | Auth |
|------|-------------|------|
| Login | Email/password, role detection | Required |
| Dashboard | Stats overview, quick actions | Required |
| Clients | List, search, filter, add new | Admin |
| Client Detail | Full profile: Info, Attendance, Payments, Documents, Letters | Admin |
| Attendance | Calendar view, batch entry, alerts | Admin |
| Payments | History, outstanding balances, manual entry | Admin |
| Documents | Upload center, form links, certificates | Admin |
| Letters | Generate completion/termination/transfer | Admin |
| Reports | Program analytics, revenue, forecasting | Admin |
| Settings | Program types, referral sources, users | Admin |
| Probation Portal | Limited view for referral sources | Referral |

---

## SECURITY REQUIREMENTS

- Row-Level Security (RLS) on all tables
- Probation officers query with `auth.uid()` filter
- PII excluded (DOB, address, race, gender, DL#, SSN)
- All API routes require auth token
- File uploads scanned for malware
- Audit log for all CRUD operations
- HTTPS globally

---

## PRICING ESTIMATE

| Phase | Scope | Estimate |
|-------|-------|----------|
| **MVP Core** | Client management, attendance, payments (manual), letters, basic reports | $4,000 - $6,000 |
| **Integrations** | Stripe webhooks, QuickBooks sync, email notifications, advanced reporting | $3,000 - $5,000 |
| **Portal Features** | Referral source portal, client portal, video tutorials, attachments | $2,500 - $4,000 |
| **Total** | | **$9,500 - $15,000** |

**Alternative:** $2,000 setup + $300/month subscription (12-month minimum)

---

## QUESTIONS SENT TO CLIENT (Awaiting Answers)

1. **Referral Source Portal Access**
   - Will probation officers log in themselves, or will you send them reports?
   - Besides probation officers, will any other referral sources need portal access?
   - Do you need them to just *view* records, or also upload documents and receive notifications?

2. **Program Tracking**
   - Can a client be enrolled in multiple programs at once?
   - When a client completes a program, should they stay in the system for historical records?

3. **Attendance Workflow**
   - Do you record attendance daily, weekly, or per session?
   - Who marks attendance — just you, or do instructors also need access?
   - Should the system automatically flag clients approaching limits, and if so, what action?

4. **Payments & Integration**
   - Should the portal automatically create payment records when Stripe payments come through?
   - Will you also need manual payment entry (for cash, money orders, etc.)?
   - Do you need the system to send payment reminders or invoices?

5. **Document Management**
   - Should the portal just *link* to HushForms, or should submitted form data flow back automatically?
   - If automatic, do you have API access with HushForms?
   - Do you have tutorial videos already, or should I include video hosting/setup?

6. **Letter Generation**
   - Do you have existing letterhead or templates for Completion/Termination/Transfer letters?
   - Should these be auto-generated as PDFs, printable, or emailed?

7. **Reporting & Forecasting**
   - What are the top 5 reports you'd use most?
   - What kind of forecasting metrics matter most?

8. **Timeline**
   - Is there a specific deadline?
   - What constitutes a successful Phase 1 launch?

9. **Branding Assets**
   - Do you have a logo file (PNG/SVG) and hex codes for the color scheme?

10. **Letter Format**
    - Is there a standard format these letters must follow for court/agency acceptance?
    - Do you need digital signatures?

---

## ARCHITECTURE MAP

**Live URL:** https://civic-mudra-pyqv.here.now/

Interactive architecture document with:
- System layers (Frontend, Backend, Integrations, Database)
- Page inventory
- User flows
- Technology stack
- Security & privacy notes

---

## NEXT STEPS

1. Receive client answers to questions above
2. Update this document with answers
3. Generate comprehensive build prompt for Bolt/AI coding agent
4. Begin Phase 1 development

---

## FILE LOCATIONS

- **Architecture Map:** `/data/.openclaw/workspace/projects/ec-dui-architecture/`
- **Live Architecture:** https://civic-mudra-pyqv.here.now/
- **This Context File:** `/data/.openclaw/workspace/projects/ec-dui-portal/MASTER_CONTEXT.md`

---

## HOW TO USE THIS DOCUMENT

When client provides answers:

1. Update the "QUESTIONS SENT TO CLIENT" section with answers
2. Update any TBD items throughout the document
3. Generate a comprehensive build prompt that includes:
   - Full requirements from this document
   - Specific answers from client
   - Technical architecture decisions
   - Database schema
   - UI/UX requirements
   - Integration specifications

The build prompt should be structured for Bolt or similar AI coding tools to execute the entire Phase 1 MVP.
