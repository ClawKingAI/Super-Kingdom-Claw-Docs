-- ============================================
-- CertTrack Database Schema for libSQL/Bolt
-- ============================================

-- Certificate Programs (14 ABWM Programs)
CREATE TABLE IF NOT EXISTS certificate_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  required_hours INTEGER NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Users (Staff)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'intake', 'completed', 'transferred', 'terminated', 'hold')),
  notes TEXT,
  is_archived INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by INTEGER REFERENCES users(id)
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  certificate_id INTEGER NOT NULL REFERENCES certificate_programs(id),
  start_date TEXT NOT NULL,
  projected_completion_date TEXT,
  completion_date TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'dropped', 'transferred')),
  completion_notes TEXT,
  staff_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by INTEGER REFERENCES users(id)
);

-- Tracked Hours
CREATE TABLE IF NOT EXISTS tracked_hours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enrollment_id INTEGER NOT NULL REFERENCES enrollments(id),
  student_id INTEGER NOT NULL REFERENCES students(id),
  certificate_id INTEGER NOT NULL REFERENCES certificate_programs(id),
  entry_date TEXT NOT NULL,
  hours REAL NOT NULL,
  minutes INTEGER DEFAULT 0,
  entry_type TEXT NOT NULL DEFAULT 'regular' CHECK (entry_type IN ('regular', 'makeup')),
  notes TEXT,
  is_approved INTEGER DEFAULT 0,
  approved_by INTEGER REFERENCES users(id),
  approved_at TEXT,
  is_active INTEGER DEFAULT 1,
  is_void INTEGER DEFAULT 0,
  void_reason TEXT,
  voided_by INTEGER REFERENCES users(id),
  voided_at TEXT,
  entered_by INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Staff Notes on Students
CREATE TABLE IF NOT EXISTS student_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  enrollment_id INTEGER REFERENCES enrollments(id),
  content TEXT NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Deletion Requests
CREATE TABLE IF NOT EXISTS deletion_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_type TEXT NOT NULL CHECK (record_type IN ('student', 'enrollment', 'tracked_hour', 'note')),
  record_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by INTEGER NOT NULL REFERENCES users(id),
  requested_at TEXT DEFAULT (datetime('now')),
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TEXT,
  admin_notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  record_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'void', 'restore', 'approve')),
  old_values TEXT,
  new_values TEXT,
  changed_by INTEGER REFERENCES users(id),
  changed_at TEXT DEFAULT (datetime('now')),
  notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_certificate ON enrollments(certificate_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_tracked_hours_enrollment ON tracked_hours(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_tracked_hours_student ON tracked_hours(student_id);
CREATE INDEX IF NOT EXISTS idx_tracked_hours_date ON tracked_hours(entry_date);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name, record_id);

-- ============================================
-- SEED DATA
-- ============================================

-- Seed 14 Certificate Programs
INSERT INTO certificate_programs (name, required_hours, description) VALUES
('Wood Shop & Commercial Table Production', 900, 'Fabrication from material preparation through finishing and crating'),
('Van/Truck Loading & Logistics Operations', 400, 'Packing methods, load planning, inventory documentation'),
('Truck Loading & Commercial Transportation Operations', 990, 'Advanced load planning, cargo securement, vehicle inspection'),
('Lawn Care & Landscape Operations', 800, 'Mowing, trimming, seasonal maintenance, irrigation basics'),
('Automotive Technician', 900, 'Preventive maintenance, brake inspection, diagnostics fundamentals'),
('Small Engine Repair & Maintenance', 400, 'Diagnosis, repair, maintenance of lawn and landscape equipment'),
('Retail Operations & Inventory Systems', 500, 'Donation intake, sorting, pricing, merchandising, inventory control'),
('Cashiering & Point-of-Sale Operations', 500, 'POS systems, cash handling, transaction processing, reconciliation'),
('Facilities Maintenance & Property Services', 900, 'Plumbing, HVAC awareness, drywall, painting, tile work, remodeling'),
('Food Service & Kitchen Operations', 700, 'Food safety, preparation workflow, sanitation, equipment use'),
('Moving Operations Dispatch & Customer Service', 800, 'Inbound inquiries, scheduling, dispatch coordination'),
('Donation Pickup Scheduling & Logistics Coordination', 700, 'Donation intake, eligibility assessment, routing coordination'),
('Media Production & Digital Content Operations', 800, 'Video production, editing, YouTube, Meta, Pando distribution'),
('Christmas Tree & Seasonal Retail Operations', 350, 'Tree lot setup, customer service, baling equipment operation');

-- Seed Users
INSERT INTO users (email, full_name, role) VALUES
('david.m@abetterway.org', 'David Morgan', 'admin'),
('john.m@abetterway.org', 'John Miller', 'admin'),
('sarah.a@abetterway.org', 'Sarah Adams', 'staff'),
('michael.w@abetterway.org', 'Michael White', 'staff');

-- Seed Students
INSERT INTO students (student_id, first_name, last_name, email, phone, status) VALUES
('STU-2024-001', 'Marcus', 'Johnson', 'marcus.j@email.com', '(555) 123-4567', 'active'),
('STU-2024-002', 'Sarah', 'Williams', 'sarah.w@email.com', '(555) 234-5678', 'active'),
('STU-2024-003', 'David', 'Thompson', 'david.t@email.com', '(555) 345-6789', 'active'),
('STU-2024-004', 'Rachel', 'Garcia', 'rachel.g@email.com', '(555) 456-7890', 'active'),
('STU-2024-005', 'Andrew', 'Peterson', 'andrew.p@email.com', '(555) 567-8901', 'active'),
('STU-2024-006', 'Lisa', 'Martinez', 'lisa.m@email.com', '(555) 678-9012', 'active');

-- Seed Enrollments
INSERT INTO enrollments (student_id, certificate_id, start_date, status, created_by)
SELECT 1, 1, '2024-01-15', 'active', 1 WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE student_id = 1 AND certificate_id = 1);

INSERT INTO enrollments (student_id, certificate_id, start_date, status, created_by)
SELECT 2, 4, '2024-02-01', 'active', 1 WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE student_id = 2 AND certificate_id = 4);

INSERT INTO enrollments (student_id, certificate_id, start_date, status, created_by)
SELECT 3, 5, '2024-01-20', 'active', 1 WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE student_id = 3 AND certificate_id = 5);

INSERT INTO enrollments (student_id, certificate_id, start_date, status, created_by)
SELECT 4, 10, '2024-03-01', 'active', 3 WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE student_id = 4 AND certificate_id = 10);

INSERT INTO enrollments (student_id, certificate_id, start_date, status, created_by)
SELECT 5, 1, '2024-02-15', 'active', 1 WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE student_id = 5 AND certificate_id = 1);

INSERT INTO enrollments (student_id, certificate_id, start_date, status, created_by)
SELECT 6, 4, '2024-03-10', 'active', 3 WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE student_id = 6 AND certificate_id = 4);

-- Seed Tracked Hours (sample data)
INSERT INTO tracked_hours (enrollment_id, student_id, certificate_id, entry_date, hours, entry_type, notes, is_approved, entered_by, approved_by, approved_at)
SELECT e.id, s.id, c.id, '2024-03-19', 4.5, 'regular', 'Tabletop construction - supervised practice', 1, 3, 1, datetime('now')
FROM students s
JOIN enrollments e ON e.student_id = s.id
JOIN certificate_programs c ON e.certificate_id = c.id
WHERE s.student_id = 'STU-2024-001' AND c.name LIKE 'Wood Shop%';

INSERT INTO tracked_hours (enrollment_id, student_id, certificate_id, entry_date, hours, entry_type, notes, is_approved, entered_by)
SELECT e.id, s.id, c.id, '2024-03-19', 3.0, 'regular', 'Mowing and trimming practice', 0, 3
FROM students s
JOIN enrollments e ON e.student_id = s.id
JOIN certificate_programs c ON e.certificate_id = c.id
WHERE s.student_id = 'STU-2024-002' AND c.name LIKE 'Lawn Care%';

-- Seed Deletion Requests (pending)
INSERT INTO deletion_requests (record_type, record_id, reason, status, requested_by)
SELECT 'tracked_hour', id, 'Entered for wrong student', 'pending', 3 FROM tracked_hours LIMIT 1;

-- ============================================
-- VIEWS FOR QUERIES
-- ============================================

-- Student Progress View
CREATE VIEW IF NOT EXISTS student_progress AS
SELECT 
  s.id AS student_id,
  s.student_id AS student_code,
  s.first_name,
  s.last_name,
  s.status AS student_status,
  e.id AS enrollment_id,
  c.id AS certificate_id,
  c.name AS certificate_name,
  c.required_hours,
  COALESCE(SUM(
    CASE 
      WHEN th.is_approved = 1 AND th.is_active = 1 AND th.is_void = 0 
      THEN th.hours + COALESCE(th.minutes, 0) / 60.0 
      ELSE 0 
    END
  ), 0) AS completed_hours,
  c.required_hours - COALESCE(SUM(
    CASE 
      WHEN th.is_approved = 1 AND th.is_active = 1 AND th.is_void = 0 
      THEN th.hours + COALESCE(th.minutes, 0) / 60.0 
      ELSE 0 
    END
  ), 0) AS remaining_hours,
  CASE 
    WHEN c.required_hours = 0 THEN 0
    ELSE ROUND(COALESCE(SUM(
      CASE 
        WHEN th.is_approved = 1 AND th.is_active = 1 AND th.is_void = 0 
        THEN th.hours + COALESCE(th.minutes, 0) / 60.0 
        ELSE 0 
      END
    ), 0) / c.required_hours * 100, 1)
  END AS percent_complete,
  e.start_date,
  e.status AS enrollment_status
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
LEFT JOIN certificate_programs c ON e.certificate_id = c.id
LEFT JOIN tracked_hours th ON th.enrollment_id = e.id
WHERE s.is_archived = 0
GROUP BY s.id, s.student_id, s.first_name, s.last_name, s.status, e.id, c.id, c.name, c.required_hours, e.start_date, e.status;