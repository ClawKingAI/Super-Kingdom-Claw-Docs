# Arise Recovery Case Manager - Planning Document

## Overview

Case management app for Arise Recovery Online (ariserecoveryonline.com) to track:
- Client attendance and program progress
- Document storage and generation
- Probation/parole officer coordination
- Payment tracking
- Completion reporting

---

## Database Schema

### 1. clients
Core client demographics and status.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| dob | DATE | |
| ssn_last4 | VARCHAR(4) | Last 4 only for privacy |
| phone | VARCHAR(20) | |
| email | VARCHAR(255) | |
| address_street | VARCHAR(255) | |
| address_city | VARCHAR(100) | |
| address_state | VARCHAR(2) | |
| address_zip | VARCHAR(10) | |
| emergency_contact_name | VARCHAR(200) | |
| emergency_contact_phone | VARCHAR(20) | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| status | ENUM | 'active', 'completed', 'transferred', 'terminated' |

### 2. probation_parole_info
Probation/parole details linked to client.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| officer_id | UUID | FK to probation_officers |
| case_number | VARCHAR(100) | Court/agency case # |
| jurisdiction | VARCHAR(100) | County/court |
| offense_type | VARCHAR(200) | |
| sentence_start_date | DATE | |
| sentence_end_date | DATE | Expected completion |
| supervision_type | ENUM | 'probation', 'parole', 'pretrial' |
| special_conditions | TEXT | Free-form notes |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 3. probation_officers
Officer directory (reusable across clients).

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| agency | VARCHAR(200) | e.g., "Maricopa County Probation" |
| email | VARCHAR(255) | |
| phone | VARCHAR(20) | |
| fax | VARCHAR(20) | |
| created_at | TIMESTAMP | |

### 4. programs
Program definitions (classes/services offered).

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(200) | e.g., "DUI Education", "Anger Management" |
| description | TEXT | |
| total_sessions | INTEGER | Required sessions |
| duration_weeks | INTEGER | |
| fee_amount | DECIMAL(10,2) | |
| is_active | BOOLEAN | |

### 5. enrollments
Client enrollment in specific programs.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| program_id | UUID | FK to programs |
| enrollment_date | DATE | |
| orientation_date | DATE | When orientation completed |
| expected_completion | DATE | |
| actual_completion | DATE | NULL until finished |
| status | ENUM | 'enrolled', 'active', 'completed', 'terminated' |
| contract_signed | BOOLEAN | |
| contract_date | DATE | |
| created_at | TIMESTAMP | |

### 6. attendance
Session attendance tracking.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| enrollment_id | UUID | FK to enrollments |
| session_date | DATE | |
| session_number | INTEGER | 1, 2, 3... |
| check_in_time | TIME | |
| check_out_time | TIME | |
| status | ENUM | 'present', 'absent', 'excused', 'late' |
| notes | TEXT | |
| recorded_by | VARCHAR(100) | Staff initials or ID |
| created_at | TIMESTAMP | |

### 7. payments
Payment records.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| enrollment_id | UUID | FK to enrollments (optional) |
| amount | DECIMAL(10,2) | |
| payment_date | DATE | |
| payment_method | ENUM | 'cash', 'card', 'money_order', 'check' |
| receipt_number | VARCHAR(50) | |
| notes | TEXT | |
| created_at | TIMESTAMP | |

### 8. documents
File uploads and generated documents.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| enrollment_id | UUID | FK to enrollments (optional) |
| document_type | ENUM | 'contract', 'id', 'completion_letter', 'receipt', 'court_order', 'other' |
| file_path | VARCHAR(500) | Storage path |
| file_name | VARCHAR(255) | Original filename |
| file_size | INTEGER | Bytes |
| mime_type | VARCHAR(100) | |
| uploaded_by | VARCHAR(100) | |
| uploaded_at | TIMESTAMP | |
| notes | TEXT | |

### 9. completion_letters
Generated completion documents.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | FK to clients |
| enrollment_id | UUID | FK to enrollments |
| generated_at | TIMESTAMP | |
| letter_content | TEXT | Full letter text |
| sent_to_officer | BOOLEAN | |
| sent_at | TIMESTAMP | |
| sent_method | ENUM | 'email', 'fax', 'mail' |
| pdf_path | VARCHAR(500) | Generated PDF path |

### 10. contract_principles
Program rules/contract terms.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| enrollment_id | UUID | FK to enrollments |
| principles_text | TEXT | Rules/expectations |
| client_signature | BOOLEAN | |
| signature_date | DATE | |
| staff_witness | VARCHAR(100) | |

---

## User Roles & Access

### Admin
- Full access to all data
- Manage probation officers
- Run reports
- Export data

### Staff
- Create/edit clients
- Record attendance
- Upload documents
- Generate completion letters
- View (not edit) probation info

### Probation Officer (limited portal)
- View assigned clients only
- See attendance records
- See completion letters
- Download documents
- No editing capability

---

## Key Workflows

### 1. New Client Intake
1. Enter demographics
2. Enter probation/parole info
3. Select probation officer from directory
4. Enroll in program(s)
5. Upload ID and court documents
6. Sign contract principles
7. Set orientation date

### 2. Daily Attendance
1. Staff opens attendance view
2. Selects program session
3. Clients check in (manual or barcode)
4. Mark present/absent/late
5. Add notes if needed
6. End-of-session closeout

### 3. Completion Letter Generation
1. Client completes all sessions
2. Staff initiates completion
3. System pulls:
   - Client demographics
   - Program details
   - Attendance summary
   - Payment status
4. Generates PDF letter
5. Option to email directly to probation officer
6. Log sent status

### 4. Probation Officer Report
1. Select officer
2. System shows all assigned clients
3. Filter by status/program
4. Export to PDF or email

---

## Reports

### By Officer
- All clients assigned to specific officer
- Status breakdown (active/completed/terminated)
- Attendance rates
- Payment compliance

### By Program
- Enrollment counts
- Completion rates
- Average time to completion
- Revenue

### By Date Range
- New enrollments
- Completions
- Absentee rates

---

## Technical Stack (Vibe-Codable)

### Recommended
- **Frontend:** Next.js 15 + React 19 + Tailwind
- **Backend:** Next.js API routes or Supabase Edge Functions
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Auth:** Supabase Auth with role-based access
- **File Storage:** Supabase Storage buckets
- **PDF Generation:** @react-pdf/renderer or Puppeteer
- **Email:** Resend or SendGrid

### Why Supabase
- Pre-built auth with RLS (Row Level Security)
- Built-in file storage
- Real-time subscriptions for attendance
- Easy to vibe-code with AI
- Free tier for MVP
- Dashboard for admin

---

## MVP Phase 1 Features

1. Client CRUD
2. Probation officer directory
3. Program enrollment
4. Attendance tracking (manual)
5. Document upload
6. Basic completion letter generation
7. Officer portal (view-only)

## Phase 2

1. Barcode/QR check-in
2. Automated email to officers
3. Payment tracking with receipts
4. Dashboard metrics
5. Bulk report generation

---

## Security Considerations

- PII encryption at rest
- Audit logging for all actions
- Officer access limited to assigned clients
- Session timeout for inactive users
- HIPAA-aware data handling practices
