# Arise Counseling Services - Case Management Platform

## Overview

Unified case management platform for all Arise programs:
- FVIP (Family Violence Intervention Program) - 24 weeks
- DUI Evaluations & Treatment
- Level-1 Substance Abuse
- Anger Management (10 sessions)
- Intensive Outpatient Program (IOP)
- Individual/Couples/Family Counseling
- Psychiatric Services

Each program has different requirements, but all share:
- Client intake and demographics
- Probation/court referral tracking
- Attendance tracking
- Payment and receipt management
- Document storage
- Completion/termination workflows
- Probation officer reporting

---

## Program-Specific Requirements

### FVIP (24-Week Family Violence)
- Georgia Commission on Family Violence certified
- 24-week minimum, weekly groups
- Gender-specific groups (men Tue/Sat, women Thu)
- Orientation required before enrollment
- Georgia reporting requirements:
  - Enter participants by 10th of following month
  - Report completion/termination/transfer by 10th
  - Notify referral source within 4 business days of completion
- Victim liaison notification requirements

### DUI Services
- Clinical evaluation ($95+ base)
- Treatment matched to evaluation
- First-time vs multiple vs habitual offender tracking
- DBHDD compliance
- Evaluator cannot be treatment provider (separation required)
- Report to Department of Driver Services

### Level-1 Substance Abuse
- 6-18 weeks duration
- Saturdays online
- $150 program fee
- For mild substance abuse or relapse prevention

### Anger Management
- 10 sessions required
- Thursdays online at 5pm
- $50 per class
- Court-ordered participants

### IOP (Intensive Outpatient Program)
- Mon/Wed/Fri 6-9pm
- Evening program for adults 18+
- Random urine screens
- 12-step integration
- Individual/family therapy components
- Aftercare planning

### Counseling Services
- Individual, couples, family
- Ongoing - no fixed session count
- $90 per session
- Insurance accepted

### Psychiatric Services
- Dr. Martha Murry (MD) - psychiatrist
- Tyanau Nunez (NP) - nurse practitioner
- Medication management
- Psychiatric evaluations
- All ages

---

## Unified Data Model

### Core Tables (All Programs)

#### clients
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| dob | DATE | |
| ssn_last4 | VARCHAR(4) | Last 4 only |
| phone | VARCHAR(20) | |
| email | VARCHAR(255) | |
| address_street | VARCHAR(255) | |
| address_city | VARCHAR(100) | |
| address_state | VARCHAR(2) | GA |
| address_zip | VARCHAR(10) | |
| emergency_contact_name | VARCHAR(200) | |
| emergency_contact_phone | VARCHAR(20) | |
| gender | VARCHAR(20) | |
| race_ethnicity | VARCHAR(50) | |
| marital_status | VARCHAR(30) | |
| employment_status | VARCHAR(50) | |
| primary_language | VARCHAR(30) | |
| insurance_name | VARCHAR(200) | |
| insurance_id | VARCHAR(100) | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### programs
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(100) | FVIP, DUI_EVAL, DUI_TREATMENT, LEVEL1_SA, ANGER_MGMT, IOP, COUNSELING, PSYCH |
| display_name | VARCHAR(200) | "Family Violence Intervention Program" |
| description | TEXT | |
| is_group_program | BOOLEAN | |
| total_sessions | INTEGER | NULL for open-ended |
| duration_weeks | INTEGER | NULL for open-ended |
| fee_structure | JSONB | {"orientation": 100, "weekly": 30} or {"per_session": 90} |
| compliance_reporting | BOOLEAN | Requires state reporting |
| created_at | TIMESTAMP | |

#### groups
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| program_id | UUID | FK to programs |
| name | VARCHAR(100) | "Men's FVIP Tuesday" |
| day_of_week | VARCHAR(10) | |
| start_time | TIME | |
| end_time | TIME | |
| facilitator_id | UUID | FK to staff |
| location | VARCHAR(200) | "Online" or address |
| is_active | BOOLEAN | |

#### enrollments
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| program_id | UUID | FK to programs |
| group_id | UUID | FK to groups (if applicable) |
| referral_source | VARCHAR(200) | Court, probation, self, attorney |
| referral_type | ENUM | 'court_ordered', 'probation', 'voluntary', 'attorney' |
| court_name | VARCHAR(200) | |
| case_number | VARCHAR(100) | |
| charge_offense | VARCHAR(200) | DUI, domestic violence, etc. |
| enrollment_date | DATE | |
| orientation_date | DATE | |
| start_date | DATE | First session |
| expected_completion_date | DATE | Auto-calculated |
| actual_completion_date | DATE | |
| status | ENUM | 'pending_orientation', 'active', 'completed', 'terminated', 'transferred', 'hold' |
| termination_reason | TEXT | |
| transfer_destination | VARCHAR(200) | |
| fee_plan | JSONB | Payment arrangement |
| balance_due | DECIMAL(10,2) | Running total |
| notes | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### probation_assignments
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| enrollment_id | UUID | FK to enrollments |
| officer_id | UUID | FK to probation_officers |
| supervision_type | ENUM | 'probation', 'parole', 'pretrial', 'none' |
| referral_date | DATE | |
| reporting_frequency | VARCHAR(50) | Weekly, monthly |
| special_conditions | TEXT | Court-mandated conditions |
| is_primary | BOOLEAN | Main officer if multiple |
| created_at | TIMESTAMP | |

#### probation_officers
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| agency | VARCHAR(200) | "Coweta County Probation" |
| email | VARCHAR(255) | |
| phone | VARCHAR(20) | |
| fax | VARCHAR(20) | |
| office_address | TEXT | |
| created_at | TIMESTAMP | |

#### staff
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| email | VARCHAR(255) | |
| phone | VARCHAR(20) | |
| role | ENUM | 'admin', 'facilitator', 'office_staff', 'psychiatrist', 'nurse_practitioner' |
| credentials | VARCHAR(200) | CACII, MAC, CCS, etc. |
| is_active | BOOLEAN | |
| created_at | TIMESTAMP | |

#### sessions
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| group_id | UUID | FK to groups |
| session_date | DATE | |
| session_number | INTEGER | Week 1, Week 2... |
| facilitator_id | UUID | FK to staff |
| topic | VARCHAR(200) | |
| notes | TEXT | |
| created_at | TIMESTAMP | |

#### attendance
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| enrollment_id | UUID | FK to enrollments |
| session_id | UUID | FK to sessions |
| status | ENUM | 'present', 'absent', 'excused', 'late' |
| check_in_time | TIME | |
| minutes_late | INTEGER | |
| notes | TEXT | |
| recorded_by | UUID | FK to staff |
| created_at | TIMESTAMP | |

#### payments
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| enrollment_id | UUID | FK to enrollments |
| amount | DECIMAL(10,2) | |
| payment_date | DATE | |
| payment_method | ENUM | 'cash', 'card', 'money_order', 'check', 'insurance' |
| receipt_number | VARCHAR(50) | Auto-generated |
| receipt_url | VARCHAR(500) | Uploaded receipt image |
| balance_after | DECIMAL(10,2) | Remaining balance |
| notes | TEXT | |
| recorded_by | UUID | FK to staff |
| created_at | TIMESTAMP | |

#### documents
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| enrollment_id | UUID | FK to enrollments |
| document_type | ENUM | 'court_order', 'intake_form', 'contract', 'assessment', 'id', 'proof_of_address', 'probation_paperwork', 'receipt', 'progress_letter', 'completion_letter', 'termination_letter', 'transfer_letter', 'psychiatric_eval', 'other' |
| file_name | VARCHAR(255) | Original filename |
| file_path | VARCHAR(500) | Storage path |
| file_size | INTEGER | Bytes |
| uploaded_by | UUID | FK to staff |
| uploaded_at | TIMESTAMP | |
| is_visible_to_officer | BOOLEAN | |
| notes | TEXT | |

#### letters
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| enrollment_id | UUID | FK to enrollments |
| letter_type | ENUM | 'completion', 'termination', 'transfer', 'progress', 'attendance_summary' |
| generated_at | TIMESTAMP | |
| generated_by | UUID | FK to staff |
| pdf_path | VARCHAR(500) | |
| emailed_to | VARCHAR(255) | Officer email |
| email_sent_at | TIMESTAMP | |
| faxed_to | VARCHAR(20) | |
| fax_sent_at | TIMESTAMP | |

#### audit_logs
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK to staff |
| client_id | UUID | FK to clients (optional) |
| action | VARCHAR(100) | 'document_upload', 'payment_recorded', 'attendance_added', 'status_changed', 'letter_generated', 'email_sent' |
| details | JSONB | Action-specific data |
| created_at | TIMESTAMP | |

#### users (Auth)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR(255) | |
| role | ENUM | 'admin', 'staff', 'facilitator', 'probation_officer' |
| staff_id | UUID | FK to staff (if internal) |
| probation_officer_id | UUID | FK to probation_officers (if PO) |
| is_active | BOOLEAN | |
| last_login | TIMESTAMP | |
| created_at | TIMESTAMP | |

---

## Compliance Automations

### FVIP-Specific
- **10th-day reminder**: Alert staff to submit monthly reports
- **4-day notification**: Auto-generate completion letter and remind staff to send to referral source
- **24-week tracker**: Flag when participant should complete
- **Gender-appropriate group**: Validate group assignment

### DUI-Specific
- **Evaluator separation**: Prevent same staff from doing both eval and treatment
- **DDS reporting**: Generate required reports for Department of Driver Services
- **Offender tier**: Track first-time vs multiple vs habitual

### General
- **Missing documents alert**: Flag incomplete intake packets
- **Balance overdue**: Alert on outstanding balances
- **Completion approaching**: Notify 2 weeks before expected completion
- **Attendance threshold**: Alert if missed sessions exceed program limit

---

## Role Permissions

### Admin
- Full access to all records
- Manage staff accounts
- Run all reports
- Configure programs and fees
- Override status changes

### Facilitator
- View assigned groups
- Record attendance
- Add session notes
- View participant profiles
- Cannot see payment details

### Office Staff
- Create/edit clients
- Process payments
- Upload documents
- Generate letters
- Send emails to officers
- Run reports

### Probation Officer (Portal)
- View only assigned participants
- See attendance summary
- See payment history
- Download completion/termination letters
- Cannot edit anything
- Cannot see internal notes

---

## Key Workflows

### 1. FVIP Intake
1. Client calls (678-216-6706)
2. Staff collects basic info
3. Schedule orientation (Wed 2pm)
4. At orientation:
   - Collect court order/referral
   - Complete intake forms
   - Sign contract
   - Collect orientation fee ($100)
   - Assign to group (men Tue/Sat or women Thu)
5. First class = start date
6. System calculates expected completion (24 weeks)

### 2. DUI Evaluation Intake
1. Client scheduled for evaluation
2. Collect offense history (first-time, multiple, habitual)
3. Evaluator completes assessment
4. System enforces: evaluator ≠ treatment provider
5. If treatment required, enroll in appropriate program
6. Generate evaluation report
7. Send to court/DDS as required

### 3. Daily Operations
1. Staff opens attendance for group
2. Participants check in
3. Mark present/absent/late
4. After session: close attendance
5. System updates session counts
6. Auto-flag absences for follow-up

### 4. Completion
1. Client completes required sessions
2. Staff verifies:
   - All sessions attended or excused
   - Balance paid or arrangements made
   - All required documents on file
3. Change status to "completed"
4. System generates completion letter
5. Staff sends to probation officer (email/fax)
6. Log transmission
7. If FVIP: system reminds about 4-day notification

### 5. Termination
1. Client fails to comply (absences, non-payment, behavior)
2. Staff documents reason
3. Change status to "terminated"
4. Generate termination letter
5. Send to referral source and probation officer
6. If FVIP: include in monthly report

---

## Reporting

### Operational Reports
- Daily attendance roster
- Weekly group summary
- Monthly enrollments/completions/terminations
- Outstanding balances
- Missing documents

### Compliance Reports (FVIP)
- Monthly submission to Georgia Commission
- Participant roster by status
- Completion/termination log

### Financial Reports
- Revenue by program
- Revenue by month
- Payment method breakdown
- Aging balances

### Program Metrics
- Completion rate by program
- Average time to completion
- Attendance rate by group
- Referral source breakdown

---

## UI Pages

### Public
- Login page
- Password reset

### Admin Dashboard
- Active clients by program
- Today's sessions
- Alerts (missing docs, overdue balances, compliance deadlines)
- Quick stats (enrollments, completions, revenue)

### Client Management
- Client list (search, filter, sort)
- Client detail page:
  - Demographics tab
  - Enrollments tab (one client can be in multiple programs)
  - Attendance tab
  - Payments tab
  - Documents tab
  - Letters tab
  - Notes tab
  - Audit trail tab

### Program Management
- Program list
- Group management
- Session calendar

### Attendance
- Today's sessions
- Check-in interface
- Attendance history
- Absence alerts

### Payments
- Payment entry
- Receipt upload
- Balance tracker
- Payment history

### Documents
- Upload interface
- Document library
- Visibility controls
- Bulk download

### Letters
- Generate completion/termination/transfer
- Email to officer
- Download PDF
- Transmission log

### Probation Officer Portal
- Login
- Assigned clients list
- Client detail (view only):
  - Status
  - Attendance summary
  - Payment compliance
  - Letters (download)
- No edit capability

### Reports
- Report builder
- Saved reports
- Export (PDF, CSV)
- Schedule email reports

### Settings
- Program configuration
- Fee schedules
- Staff management
- Probation officer directory
- User accounts
- Audit log viewer

---

## Technical Stack

### Recommended
- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **PDF**: @react-pdf/renderer
- **Email**: Resend
- **Charts**: Recharts
- **Date handling**: date-fns
- **Forms**: React Hook Form + Zod

### Why This Stack
- Supabase handles auth + database + storage + real-time
- Row Level Security for probation officer portal
- Vibe-codeable - AI can scaffold quickly
- Modern UI components out of the box
- Free tier sufficient for MVP

---

## Bolt.new Prompt

> Build a case management platform for Arise Counseling Services. This is a multi-program counseling center offering FVIP (24-week family violence intervention), DUI evaluations and treatment, substance abuse classes, anger management, IOP, individual counseling, and psychiatric services.
>
> Use Next.js 15, Supabase, Tailwind CSS, and shadcn/ui.
>
> Core features:
> 1. Client intake with demographics, referral source, court/probation info
> 2. Multi-program enrollment (one client can be in multiple programs)
> 3. Program-specific session tracking (FVIP = 24 sessions, Anger Mgmt = 10, IOP = ongoing)
> 4. Attendance tracking with status (present/absent/excused/late)
> 5. Payment tracking with receipt upload and balance management
> 6. Document management with visibility controls (some visible to probation officers)
> 7. Completion/termination/transfer workflows with letter generation
> 8. Email packet builder - generate comprehensive PDF to send to probation officers
> 9. Probation officer portal (view-only access to assigned clients)
> 10. Compliance tracking for Georgia FVIP requirements (10th-day reporting, 4-day notification)
> 11. Dashboard with alerts, metrics, and quick actions
> 12. Audit logging
>
> Roles: Admin, Facilitator, Office Staff, Probation Officer
>
> Programs table should include: FVIP, DUI_EVAL, DUI_TREATMENT, LEVEL1_SA, ANGER_MGMT, IOP, COUNSELING, PSYCH
>
> Groups are program-specific sessions (e.g., "Men's FVIP Tuesday", "Anger Management Thursday")
>
> Design should be professional, clean, suitable for court/probation context - not consumer-facing.
>
> Include seed data for testing.
