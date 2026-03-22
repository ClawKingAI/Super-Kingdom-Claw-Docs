// Data access functions for CertTrack
import db, { query, queryOne, execute } from './db'
import type { InValue } from '@libsql/client'

// Types
export interface Certificate {
  id: number
  name: string
  required_hours: number
  description: string | null
  is_active: number
}

export interface Student {
  id: number
  student_id: string
  first_name: string
  last_name: string
  preferred_name: string | null
  email: string | null
  phone: string | null
  status: string
  notes: string | null
  is_archived: number
}

export interface Enrollment {
  id: number
  student_id: number
  certificate_id: number
  start_date: string
  projected_completion_date: string | null
  completion_date: string | null
  status: string
  completion_notes: string | null
  staff_notes: string | null
}

export interface TrackedHour {
  id: number
  enrollment_id: number
  student_id: number
  certificate_id: number
  entry_date: string
  hours: number
  minutes: number
  entry_type: string
  notes: string | null
  is_approved: number
  is_active: number
  is_void: number
  entered_by: number
}

export interface StudentProgress {
  student_id: number
  student_code: string
  first_name: string
  last_name: string
  student_status: string
  enrollment_id: number | null
  certificate_id: number | null
  certificate_name: string | null
  required_hours: number | null
  completed_hours: number
  remaining_hours: number
  percent_complete: number
  start_date: string | null
  enrollment_status: string | null
}

// Certificates
export async function getCertificates(): Promise<Certificate[]> {
  return query<Certificate>('SELECT * FROM certificate_programs WHERE is_active = 1 ORDER BY name')
}

export async function getCertificateById(id: number): Promise<Certificate | null> {
  return queryOne<Certificate>('SELECT * FROM certificate_programs WHERE id = ?', [id])
}

// Students
export async function getStudents(): Promise<Student[]> {
  return query<Student>('SELECT * FROM students WHERE is_archived = 0 ORDER BY last_name, first_name')
}

export async function getStudentById(id: number): Promise<Student | null> {
  return queryOne<Student>('SELECT * FROM students WHERE id = ?', [id])
}

export async function getStudentByCode(code: string): Promise<Student | null> {
  return queryOne<Student>('SELECT * FROM students WHERE student_id = ?', [code])
}

export async function createStudent(data: {
  student_id: string
  first_name: string
  last_name: string
  preferred_name?: string
  email?: string
  phone?: string
  status?: string
  notes?: string
  created_by: number
}): Promise<number> {
  const result = await execute(
    `INSERT INTO students (student_id, first_name, last_name, preferred_name, email, phone, status, notes, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.student_id, data.first_name, data.last_name, data.preferred_name || null, data.email || null, data.phone || null, data.status || 'active', data.notes || null, data.created_by]
  )
  return Number(result.lastInsertRowid)
}

export async function updateStudent(id: number, data: Partial<Student>): Promise<void> {
  const fields: string[] = []
  const values: InValue[] = []
  
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'id' && key !== 'created_at') {
      fields.push(`${key} = ?`)
      values.push(value as InValue)
    }
  }
  
  if (fields.length > 0) {
    fields.push('updated_at = datetime("now")')
    values.push(id)
    await execute(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`, values)
  }
}

// Enrollments
export async function getEnrollments(): Promise<Enrollment[]> {
  return query<Enrollment>('SELECT * FROM enrollments ORDER BY start_date DESC')
}

export async function getActiveEnrollmentForStudent(studentId: number): Promise<Enrollment | null> {
  return queryOne<Enrollment>(
    'SELECT * FROM enrollments WHERE student_id = ? AND status = ? LIMIT 1',
    [studentId, 'active']
  )
}

export async function createEnrollment(data: {
  student_id: number
  certificate_id: number
  start_date: string
  projected_completion_date?: string
  status?: string
  created_by: number
}): Promise<number> {
  const result = await execute(
    `INSERT INTO enrollments (student_id, certificate_id, start_date, projected_completion_date, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.student_id, data.certificate_id, data.start_date, data.projected_completion_date || null, data.status || 'active', data.created_by]
  )
  return Number(result.lastInsertRowid)
}

// Tracked Hours
export async function getTrackedHours(filters?: {
  student_id?: number
  certificate_id?: number
  start_date?: string
  end_date?: string
}): Promise<TrackedHour[]> {
  let sql = 'SELECT * FROM tracked_hours WHERE is_active = 1 AND is_void = 0'
  const params: InValue[] = []
  
  if (filters?.student_id) {
    sql += ' AND student_id = ?'
    params.push(filters.student_id)
  }
  if (filters?.certificate_id) {
    sql += ' AND certificate_id = ?'
    params.push(filters.certificate_id)
  }
  if (filters?.start_date) {
    sql += ' AND entry_date >= ?'
    params.push(filters.start_date)
  }
  if (filters?.end_date) {
    sql += ' AND entry_date <= ?'
    params.push(filters.end_date)
  }
  
  sql += ' ORDER BY entry_date DESC'
  return query<TrackedHour>(sql, params)
}

export async function createTrackedHour(data: {
  enrollment_id: number
  student_id: number
  certificate_id: number
  entry_date: string
  hours: number
  minutes?: number
  entry_type?: string
  notes?: string
  is_approved?: boolean
  entered_by: number
}): Promise<number> {
  const result = await execute(
    `INSERT INTO tracked_hours (enrollment_id, student_id, certificate_id, entry_date, hours, minutes, entry_type, notes, is_approved, entered_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.enrollment_id,
      data.student_id,
      data.certificate_id,
      data.entry_date,
      data.hours,
      data.minutes || 0,
      data.entry_type || 'regular',
      data.notes || null,
      data.is_approved ? 1 : 0,
      data.entered_by
    ]
  )
  return Number(result.lastInsertRowid)
}

export async function approveTrackedHour(id: number, approvedBy: number): Promise<void> {
  await execute(
    `UPDATE tracked_hours SET is_approved = 1, approved_by = ?, approved_at = datetime("now") WHERE id = ?`,
    [approvedBy, id]
  )
}

export async function voidTrackedHour(id: number, reason: string, voidedBy: number): Promise<void> {
  await execute(
    `UPDATE tracked_hours SET is_void = 1, void_reason = ?, voided_by = ?, voided_at = datetime("now") WHERE id = ?`,
    [reason, voidedBy, id]
  )
}

// Progress View
export async function getStudentProgress(): Promise<StudentProgress[]> {
  return query<StudentProgress>('SELECT * FROM student_progress ORDER BY last_name, first_name')
}

export async function getStudentProgressById(studentId: number): Promise<StudentProgress | null> {
  return queryOne<StudentProgress>('SELECT * FROM student_progress WHERE student_id = ?', [studentId])
}

// Dashboard Stats
export async function getDashboardStats() {
  const [activeStudents] = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM students WHERE is_archived = 0 AND status = 'active'"
  )
  
  const [activeEnrollments] = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM enrollments WHERE status = 'active'"
  )
  
  const [hoursThisWeek] = await query<{ total: number }>(
    `SELECT COALESCE(SUM(hours), 0) as total FROM tracked_hours 
     WHERE entry_date >= date('now', '-7 days') AND is_active = 1 AND is_void = 0`
  )
  
  const [nearCompletion] = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM student_progress WHERE percent_complete >= 80 AND enrollment_status = 'active'"
  )
  
  const [behindPace] = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM student_progress WHERE percent_complete <= 35 AND percent_complete > 0 AND enrollment_status = 'active'"
  )
  
  const [pendingDeletions] = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM deletion_requests WHERE status = 'pending'"
  )
  
  return {
    activeStudents: activeStudents?.count || 0,
    activeEnrollments: activeEnrollments?.count || 0,
    hoursThisWeek: hoursThisWeek?.total || 0,
    nearCompletion: nearCompletion?.count || 0,
    behindPace: behindPace?.count || 0,
    pendingDeletions: pendingDeletions?.count || 0,
  }
}

// Deletion Requests
export async function getDeletionRequests(status?: string) {
  let sql = 'SELECT * FROM deletion_requests'
  const params: InValue[] = []
  
  if (status) {
    sql += ' WHERE status = ?'
    params.push(status)
  }
  
  sql += ' ORDER BY requested_at DESC'
  return query(sql, params)
}

export async function createDeletionRequest(data: {
  record_type: string
  record_id: number
  reason: string
  requested_by: number
}): Promise<number> {
  const result = await execute(
    `INSERT INTO deletion_requests (record_type, record_id, reason, requested_by) VALUES (?, ?, ?, ?)`,
    [data.record_type, data.record_id, data.reason, data.requested_by]
  )
  return Number(result.lastInsertRowid)
}

export async function reviewDeletionRequest(id: number, approved: boolean, reviewedBy: number, notes?: string): Promise<void> {
  const status = approved ? 'approved' : 'rejected'
  await execute(
    `UPDATE deletion_requests SET status = ?, reviewed_by = ?, reviewed_at = datetime("now"), admin_notes = ? WHERE id = ?`,
    [status, reviewedBy, notes || null, id]
  )
  
  // If approved, void or archive the record
  if (approved) {
    const request = await queryOne<{ record_type: string; record_id: number }>(
      'SELECT record_type, record_id FROM deletion_requests WHERE id = ?',
      [id]
    )
    
    if (request) {
      if (request.record_type === 'tracked_hour') {
        await execute('UPDATE tracked_hours SET is_void = 1, is_active = 0 WHERE id = ?', [request.record_id])
      } else if (request.record_type === 'student') {
        await execute('UPDATE students SET is_archived = 1 WHERE id = ?', [request.record_id])
      }
    }
  }
}

// Audit Log
export async function logAudit(data: {
  table_name: string
  record_id: number
  action: string
  old_values?: string
  new_values?: string
  changed_by?: number
  notes?: string
}): Promise<void> {
  await execute(
    `INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.table_name, data.record_id, data.action, data.old_values || null, data.new_values || null, data.changed_by || null, data.notes || null]
  )
}