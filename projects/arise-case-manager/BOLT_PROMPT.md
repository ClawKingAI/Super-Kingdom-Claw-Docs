# Arise Case Manager - Full Build Prompt for Bolt.new or z.ai GLM-5

## PASTE THIS ENTIRE PROMPT INTO BOLT.NEW OR Z.AI CHAT:

---

Build a complete case management platform called **Arise Case Manager** for Arise Counseling Services. This is a multi-program counseling center that needs to track clients across FVIP (Family Violence Intervention), DUI evaluations/treatment, substance abuse, anger management, IOP, individual counseling, and psychiatric services.

### BUSINESS CONTEXT

Arise Counseling Services (ariserecoveryonline.com) is a Georgia-certified counseling center offering:
- **FVIP**: 24-week Family Violence Intervention Program (Georgia Commission on Family Violence certified)
- **DUI Services**: Clinical evaluations and treatment (DBHDD approved)
- **Level-1 Substance Abuse**: 6-18 weeks, Saturday classes
- **Anger Management**: 10 sessions, Thursday online
- **IOP**: Mon/Wed/Fri evenings, adults 18+
- **Counseling**: Individual, couples, family (ongoing)
- **Psychiatric**: Medication management, all ages

They need to track:
- Client intake and demographics
- Court/probation referrals
- Attendance by session
- Payments and receipts
- Document uploads
- Completion/termination letters
- Probation officer communications
- Georgia FVIP compliance (10th-day reporting, 4-day referral notification)

### TECH STACK

Use **Next.js 15**, **Supabase** (PostgreSQL, Auth, Storage, RLS), **Tailwind CSS**, and **shadcn/ui**.

### DATABASE SCHEMA

Create these tables:

**clients**
- id (UUID, primary key)
- first_name, last_name, dob, phone, email
- address_street, address_city, address_state, address_zip
- emergency_contact_name, emergency_contact_phone
- gender, race_ethnicity, marital_status, employment_status, primary_language
- insurance_name, insurance_id
- created_at, updated_at

**programs**
- id (UUID, primary key)
- name (VARCHAR): FVIP, DUI_EVAL, DUI_TREATMENT, LEVEL1_SA, ANGER_MGMT, IOP, COUNSELING, PSYCH
- display_name, description
- is_group_program (boolean)
- total_sessions, duration_weeks (nullable for open-ended)
- fee_structure (JSONB: {"orientation": 100, "weekly": 30})
- compliance_reporting (boolean)

**groups**
- id (UUID, primary key)
- program_id (FK to programs)
- name (e.g., "Men's FVIP Tuesday", "Women's FVIP Thursday")
- day_of_week, start_time, end_time
- facilitator_id (FK to staff)
- location (VARCHAR, "Online" or address)
- is_active

**staff**
- id, first_name, last_name, email, phone
- role (admin, facilitator, office_staff, psychiatrist, nurse_practitioner)
- credentials (CACII, MAC, CCS, etc.)
- is_active

**enrollments**
- id (UUID, primary key)
- client_id (FK to clients)
- program_id (FK to programs)
- group_id (FK to groups, nullable)
- referral_source, referral_type (court_ordered, probation, voluntary, attorney)
- court_name, case_number, charge_offense
- enrollment_date, orientation_date, start_date
- expected_completion_date, actual_completion_date
- status (pending_orientation, active, completed, terminated, transferred, hold)
- termination_reason, transfer_destination
- fee_plan (JSONB), balance_due
- notes

**probation_officers**
- id, first_name, last_name
- agency, email, phone, fax, office_address

**probation_assignments**
- id, enrollment_id (FK), officer_id (FK)
- supervision_type (probation, parole, pretrial, none)
- referral_date, reporting_frequency, special_conditions
- is_primary

**sessions**
- id, group_id (FK), session_date, session_number
- facilitator_id, topic, notes

**attendance**
- id, enrollment_id (FK), session_id (FK)
- status (present, absent, excused, late)
- check_in_time, minutes_late, notes
- recorded_by (FK to staff)

**payments**
- id, client_id (FK), enrollment_id (FK)
- amount, payment_date, payment_method (cash, card, money_order, check, insurance)
- receipt_number, receipt_url, balance_after
- notes, recorded_by

**documents**
- id, client_id (FK), enrollment_id (FK)
- document_type (court_order, intake_form, contract, assessment, id, proof_of_address, probation_paperwork, receipt, progress_letter, completion_letter, termination_letter, transfer_letter, psychiatric_eval, other)
- file_name, file_path, file_size
- uploaded_by, uploaded_at
- is_visible_to_officer (boolean)
- notes

**letters**
- id, enrollment_id (FK)
- letter_type (completion, termination, transfer, progress, attendance_summary)
- generated_at, generated_by (FK to staff)
- pdf_path
- emailed_to, email_sent_at
- faxed_to, fax_sent_at

**audit_logs**
- id, user_id (FK to staff), client_id (FK, optional)
- action (document_upload, payment_recorded, attendance_added, status_changed, letter_generated, email_sent)
- details (JSONB), created_at

**users** (Auth)
- id, email, role (admin, staff, facilitator, probation_officer)
- staff_id (FK, if internal)
- probation_officer_id (FK, if PO)
- is_active, last_login

### USER ROLES & PERMISSIONS

**Admin**: Full access to all records, manage staff accounts, configure programs/fees, run all reports, override status changes.

**Facilitator**: View assigned groups, record attendance, add session notes, view participant profiles. Cannot see payment details.

**Office Staff**: Create/edit clients, process payments, upload documents, generate letters, send emails to officers, run reports.

**Probation Officer** (portal access only): View only their assigned participants. See attendance summary, payment history, download completion/termination letters. Cannot edit anything. Cannot see internal notes.

Use Supabase Row Level Security (RLS) to enforce these permissions.

### CORE PAGES

1. **Login Page**: Clean auth, password reset link

2. **Admin Dashboard**: 
   - Active clients by program
   - Today's sessions
   - Alerts: missing documents, overdue balances, compliance deadlines
   - Quick stats: enrollments this week, completions, revenue

3. **Client List**: 
   - Search by name, case number, phone
   - Filter by program, status, probation officer, court
   - Sort columns
   - Quick actions: view, record payment, mark attendance

4. **Client Detail Page** (main operational hub):
   - Tabs: Overview, Enrollments, Attendance, Payments, Documents, Letters, Notes, Audit Trail
   - Overview: demographics, current status, probation officer info, balance summary
   - Enrollments: program history, one client can be in multiple programs
   - Attendance: session-by-session with status, running totals
   - Payments: payment history, receipt uploads, outstanding balance
   - Documents: file library with visibility toggle for PO
   - Letters: generated letters with send status

5. **Attendance Page**:
   - Today's sessions
   - Select group, see enrolled clients
   - Mark present/absent/late/excused
   - Add notes per session
   - Auto-calculate attendance percentages

6. **Payments Page**:
   - Payment entry form
   - Receipt upload (image/PDF)
   - Balance tracker
   - Payment history with filters

7. **Documents Page**:
   - Upload with type selection
   - Visibility control (visible to PO or internal only)
   - Preview/download
   - Bulk actions

8. **Letters Page**:
   - Generate completion/termination/transfer letter
   - Preview before sending
   - Email directly to probation officer
   - Download PDF
   - Transmission log

9. **Probation Officer Portal**:
   - Login for external POs
   - List of their assigned clients
   - Client detail (view only):
     - Status, program, start/end dates
     - Attendance summary with percentages
     - Payment compliance
     - Downloadable letters
   - No edit capability

10. **Reports Page**:
    - Operational: daily attendance, weekly summary, monthly enrollments/completions
    - Compliance: FVIP monthly report data
    - Financial: revenue by program, aging balances
    - Program metrics: completion rates, attendance rates
    - Export to CSV/PDF

11. **Settings Page**:
    - Program configuration (fees, duration)
    - Staff management
    - Probation officer directory
    - User accounts

### KEY WORKFLOWS

**New Client Intake**:
1. Staff creates client record with demographics
2. Enters probation/court referral info
3. Selects probation officer from directory
4. Enrolls in program(s)
5. Uploads ID, court order, referral documents
6. Signs contract (or marks as signed)
7. Schedules orientation if required (FVIP)

**Daily Attendance**:
1. Staff opens today's session for group
2. System shows enrolled participants
3. Mark each present/absent/late
4. Add notes for any issues
5. Close session - system updates attendance counts
6. Auto-flag if attendance threshold crossed

**Completion Workflow**:
1. Client completes required sessions
2. Staff verifies: all sessions, balance clear, documents complete
3. Change status to "completed"
4. System generates completion letter
5. Staff reviews and emails to probation officer
6. Log transmission date and method
7. For FVIP: system reminds about 4-day referral notification requirement

**Email Case Packet**:
1. Staff clicks "Generate Case Packet" on client detail
2. System compiles: demographics, attendance history, payment history, balance, completion letter, selected documents
3. Opens email compose with packet attached
4. Send to probation officer email on file
5. Log in audit trail

### COMPLIANCE AUTOMATION

For FVIP specifically:
- Alert on 5th of month: "Monthly report due by 10th"
- Alert when completion entered: "Notify referral source within 4 business days"
- Auto-calculate expected completion from start date (24 weeks)
- Track orientation completion before first session

For DUI:
- Enforce evaluator ≠ treatment provider separation
- Flag first-time vs multiple vs habitual offender
- DDS report generation

General:
- Missing documents alert (no ID, no court order, etc.)
- Balance overdue alert (>30 days)
- Attendance threshold alert (>2 absences)
- Expected completion approaching (2 weeks out)

### DESIGN REQUIREMENTS

- Professional, clean, suitable for court/probation context
- NOT consumer-facing or startup-y
- Card-based layouts with subtle shadows
- Strong typography, readable at a glance
- Responsive: works on desktop and tablet
- Color scheme: deep blues, slate, with accent colors per program
- Icons: simple, consistent (lucide-react or similar)
- Tables: sortable, filterable, with pagination
- Forms: clear labels, validation, helpful error messages
- No unnecessary animation or decoration

### SEED DATA

Include realistic demo data:
- 10-15 clients across different programs
- 2-3 facilitators
- 3-4 probation officers (different counties)
- 4-5 groups (Men's FVIP Tue, Men's FVIP Sat, Women's FVIP Thu, Anger Mgmt Thu, Level-1 Sat)
- Sample attendance records
- Sample payments
- Sample documents (placeholders)
- Sample completion and termination letters

### SECURITY

- Supabase Auth with email/password
- RLS policies: POs only see their assigned clients
- Audit logging for all sensitive actions
- Session timeout after inactivity
- Document access logged

### IMPLEMENTATION ORDER

1. Set up Supabase project with schema
2. Configure auth and RLS policies
3. Build client management (list, create, detail)
4. Build enrollment and program tracking
5. Build attendance tracking
6. Build payment tracking
7. Build document upload
8. Build letter generation
9. Build probation officer portal
10. Build reports
11. Add compliance automation
12. Polish UI and add seed data

### SUCCESS CRITERIA

- Staff can complete intake in under 5 minutes
- Attendance can be recorded in under 30 seconds per group
- Completion letters can be generated and sent in under 2 minutes
- Probation officers can self-serve for status checks
- Compliance deadlines are never missed
- All data is audit-trail logged

---

## END OF PROMPT

This prompt contains everything needed to build the complete application. The database schema, user roles, pages, workflows, compliance rules, and design requirements are all specified. Begin by setting up the Supabase schema and auth, then build features in the implementation order listed.
