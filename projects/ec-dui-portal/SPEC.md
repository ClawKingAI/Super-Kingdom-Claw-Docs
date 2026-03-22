# EC DUI School Client Support Services Portal
## Project Specification & Planning

**Client:** East Coweta DUI School & Risk Reduction Center, LLC
**Date:** 2026-03-18

---

## Business Overview

- **Official Name:** East Coweta DUI School & Risk Reduction Center, LLC
- **Short Name:** EC DUI School
- **Portal Name:** EC DUI School Client Support Services Portal
- **Mission:** "Improving Quality of Life for Individuals & Families"
- **Vision:** To become a national model as a preferred school of choice

---

## Core Requirements

### 1. Platform Landing Page

**Branding:**
- Color scheme: Blue, Yellow, Green, Orange (official business colors)
- Title: East Coweta DUI School & Risk Reduction Center, LLC
- Portal name visible
- Mission statement on front page/overview
- Vision statement included

**Features:**
- Email, Save, Print buttons throughout
- Reporting & Analytics dashboard with forecasting capabilities

### 2. Client Management

**Client Detail View includes:**
- Name, Phone, Email
- Program Type
- Start Date, End Date
- Attendance tracking
- Payment history
- County of Referral
- Referral Source (dropdown):
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

### 3. Attendance Tracking

- Per-client attendance
- **Limits:** 3 absences maximum, 3 lates maximum
- Visual indicators when approaching limits
- Attendance history log

### 4. Payments & Receipts

**Payment Integration Options:**
- QuickBooks integration
- Apple Pay, Zelle (or email notifications)
- Automatic payment recording when received

**Payment Data Captured:**
- Amount
- Customer name & email
- Paid date
- Payment method (last 4 digits)
- Authorization ID
- Linked to client record

### 5. Document Management

**Privacy Constraint:**
- Client demographic security is critical
- DO NOT collect/store: Date of birth, Address, Race, Gender, Driver's license number
- Minimize PII transfer

**Registration Forms (HushForms integration):**
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

**Tutorial/Orientation Videos:**
- FVIP Contract walkthrough
- FVIP Principles of Practice walkthrough

### 6. Letter Generation

**Letter Types:**
1. **Completion Letter** - For: FVIP, Anger Management, Victim Impact Panel, Parenting, Shoplifting
   - Includes: Start date, End date, Total days attended, Total absences, Money paid, Balance

2. **Letter of Termination**

3. **Letter of Transfer**

### 7. Attachment Upload Section

**Two-way document sharing:**
- Referral sources upload: Case management plans, other documents
- Business uploads: Certificates of completion (Risk Reduction, Driver Improvement, 420-Marijuana)

---

## Technical Architecture

### Frontend
- React + TailwindCSS (matches workflow site)
- Mobile-responsive design
- Print-friendly layouts

### Backend Options
**Option A: Supabase (Recommended)**
- PostgreSQL database with row-level security
- Built-in authentication
- File storage for attachments
- Real-time updates
- Quick setup, reasonable pricing

**Option B: Custom Node.js + PostgreSQL**
- More control
- Higher development cost
- Self-hosted

### Integrations Needed

| Integration | Complexity | Notes |
|-------------|------------|-------|
| HushForms | Medium | Webhook or manual export/import |
| QuickBooks | High | OAuth, API integration |
| Payment notifications | Medium | Email parsing or webhook |
| Email sending | Low | SendGrid/Resend |
| PDF generation | Low | jsPDF or server-side |
| Print styles | Low | CSS media queries |

---

## Database Schema (Draft)

```
clients
├── id (UUID)
├── name
├── phone
├── email
├── program_type
├── start_date
├── end_date
├── county_of_referral
├── referral_source
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
```

---

## Client Responses (Received)

1. **User Accounts & Roles**
   - Primary user: Business owner
   - Secondary users: Probation officers (view-only, filtered to their own case members)

2. **Data Storage Location**
   - No HIPAA requirements

3. **Payment Integration Priority**
   - Stripe is the payment processor
   - Development will continue with Bolt (integrates Stripe + QuickBooks)

4. **HushForms Integration**
   - TBD - client unsure

5. **Existing Systems**
   - Starting fresh (no import needed)

### Important (Ask Before Build)

6. **Reporting Requirements**
   - What specific reports do you need? (Monthly attendance, payment totals, program completion rates?)
   - What "forecasting" metrics matter most?

7. **Letter Templates**
   - Do you have existing letter templates? Can you provide them?
   - What letterhead/logo should appear?

8. **Multi-location**
   - Is this for one location only, or multiple locations?

9. **Mobile Access**
   - Do you need mobile app, or is mobile-friendly website sufficient?

10. **Timeline**
    - When do you need this operational?
    - Are there compliance deadlines?

---

## Pricing Estimate

### Phase 1: MVP Core System
**Scope:**
- Client management (CRUD)
- Attendance tracking with limits enforcement
- Payment tracking (manual entry)
- Document linking (HushForms URLs)
- Letter generation (PDF)
- Basic reporting

**Estimate: $4,000 - $6,000**

### Phase 2: Integrations
**Scope:**
- Payment notification parsing/webhooks
- QuickBooks integration
- Email notifications
- Advanced reporting & forecasting

**Estimate: $3,000 - $5,000**

### Phase 3: Portal Features
**Scope:**
- Referral source portal (external access)
- Client portal (view own records)
- Tutorial video hosting
- Attachment uploads

**Estimate: $2,500 - $4,000**

### Total Range: $9,500 - $15,000

**Payment Structure:**
- 40% Phase 1 start
- 30% Phase 1 delivery / Phase 2 start
- 30% Final delivery

---

## Alternative: Subscription Model

If upfront cost is too high:

- **Setup Fee:** $2,000
- **Monthly:** $300/month (includes hosting, maintenance, updates)
- **Minimum:** 12 months

---

## Next Steps

1. Get answers to critical questions above
2. Clarify MVP scope
3. Provide formal quote
4. Build prototype (1-2 weeks for Phase 1 MVP)
