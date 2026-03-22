# EC DUI School Client Support Services Portal
## Complete Build Plan

---

## 1. Database Foundation and Security
- Create all database tables with proper relationships: clients, programs, attendance, payments, documents, letters, referral_sources, users, and notifications
- Set up enum types for all status fields, referral sources, document types, letter types, and notification types
- Configure Row Level Security policies to ensure referral sources can only view their own referred clients
- Create database functions for automatic timestamp updates and balance calculations
- Set up audit logging for tracking all data changes
- Enable encryption at rest for all sensitive data fields

## 2. Authentication and User Management
- Build email and password authentication system with role-based access
- Create user registration flow with role assignment (admin, office_assistant, referral_source)
- Implement forgot password and password reset functionality
- Set up protected routes that redirect users based on their role after login
- Create middleware to verify user permissions before accessing restricted pages
- Build user profile management for updating email and password

## 3. Core Layout and Navigation
- Design application header with EC DUI School branding, logo placeholder, portal name, user menu, and notifications bell
- Build responsive sidebar navigation with links to all major sections
- Create footer displaying mission statement and copyright information
- Implement global actions (EMAIL, SAVE, PRINT buttons) that work contextually on each page
- Design mobile-responsive navigation that collapses on smaller screens
- Apply brand colors throughout the interface

## 4. Admin Dashboard
- Create statistics overview cards showing active clients, clients approaching limits, monthly payments, and completion rates
- Build quick action buttons for common tasks: Add Client, Mark Attendance, Record Payment
- Display recent activity log showing latest system events
- Add prominent display of mission statement and vision statement
- Create visual indicators with yellow, orange, and red alerts for clients approaching absence and late limits
- Design widgets showing program-specific metrics

## 5. Client Management System
- Build comprehensive client list page with searchable table showing name, program, status, start date, and balance due
- Implement advanced filtering by program, status, referral source, and county
- Add sortable columns for all table fields
- Create Add New Client form collecting all required information including program selection, referral details, and contact information
- Build detailed client view with tabbed interface for Info, Attendance, Payments, Documents, and Letters
- Add client editing functionality with validation
- Implement CSV export for client data

## 6. Attendance Tracking Interface
- Create date picker for selecting session dates
- Build program filter to show only clients in specific programs
- Design bulk attendance marking interface allowing selection of multiple clients
- Implement visual status indicators: green for present, yellow for late, red for absent
- Add running counters for absences and lates with visual alerts
- Create alert system showing red warning when approaching the 3-absence or 3-late limit
- Build session number auto-increment functionality
- Add confirmation dialog when attempting to mark more than 3 absences or lates

## 7. Payment Recording and Tracking
- Create payment entry form with fields for amount, payment method, authorization ID, date, and notes
- Build payment method dropdown with options: Cash, Card, Zelle, Apple Pay, Other
- Implement automatic balance calculation based on program fee minus total payments
- Design payment history table for each client showing all transactions
- Create system-wide payments page with filtering and search
- Build receipt generation with print-friendly format
- Add CSV export for payment reports

## 8. Document Management System
- Create organized display of HushForms registration links for all 10 programs
- Build document upload interface for referral sources and administrators
- Design document list showing file name, type, program, upload date, and uploaded by
- Implement file download functionality
- Add document categorization by type: registration, contract, certificate, case plan, other
- Create document preview capability where applicable
- Build access controls so referral sources only see documents for their clients

## 9. Letter Generation System
- Design letter creation interface with type selector for Completion, Termination, and Transfer letters
- Build program selector and client auto-complete fields
- Create preview section showing all calculated data: start date, end date, attendance totals, absences, payments, and balance
- Implement PDF generation with business letterhead
- Add proper date formatting displaying dates like "March 1, 2026"
- Build download functionality for generated letters
- Create email delivery system to send letters directly to referral sources
- Store letter snapshots in database for future reference

## 10. Automated Email Notification System
- Build notification triggers for client enrollment sending email to referral source
- Create completion notification with automatic letter attachment
- Implement termination notification system
- Design transfer notification sending to both old and new referral sources
- Build configurable email templates with dynamic field replacement
- Create notification queue system tracking pending, sent, and failed messages
- Add retry logic for failed email deliveries

## 11. Reporting and Analytics Dashboard
- Create monthly revenue by program report with date range selection
- Build completion rates by program visualization with charts
- Design attendance compliance report showing clients approaching limits
- Implement referral source activity report tracking client counts and completion rates
- Create outstanding balances report with aging categories
- Add export functionality for all reports in CSV and PDF formats
- Build interactive charts and visualizations for key metrics

## 12. Settings and Configuration
- Build programs management interface for adding, editing, and deactivating programs
- Create referral sources management for maintaining contact information
- Design user management panel for adding new users and assigning roles
- Implement letter template configuration allowing customization of letter content
- Build email notification settings for enabling and disabling specific notification types
- Add system configuration for default values like maximum absences and lates

## 13. Referral Source Portal
- Create separate dashboard view filtered to show only clients referred by logged-in referral source
- Build read-only client list with status and attendance summary
- Design attendance view showing session-by-session history without editing capability
- Implement payment status display showing balance information
- Add completion letter download functionality
- Create document upload interface for case management files
- Remove access to system settings, other clients, and administrative functions

## 14. Data Validation and Business Rules
- Implement validation preventing collection of excluded PII: date of birth, physical address, race, gender, driver's license number, SSN
- Create business rules enforcing maximum of 3 absences and 3 lates
- Build validation for required fields on all forms
- Add email format validation
- Implement phone number formatting
- Create date validation ensuring logical date ranges
- Build balance validation preventing negative payments

## 15. Responsive Design and Accessibility
- Ensure all pages work properly on mobile devices, tablets, and desktops
- Implement proper color contrast ratios meeting accessibility standards
- Add keyboard navigation support throughout the application
- Create screen reader friendly labels and ARIA attributes
- Build touch-friendly interface elements for mobile users
- Test all functionality across different screen sizes

## 16. Print and Export Functionality
- Create print-friendly views for all major pages removing navigation and unnecessary elements
- Build CSV export for client lists with all relevant fields
- Implement PDF generation for reports with proper formatting
- Add email functionality to send current view data to specified addresses
- Create batch print capability for multiple records
- Design professional print layouts matching business branding

## 17. Initial Data Setup
- Populate programs table with all 10 programs including session counts, fees, and absence limits
- Create initial admin user account
- Set up common referral source entries
- Configure default email templates
- Initialize system settings with standard values
- Create sample data for testing and demonstration purposes

---

## Summary

This plan creates a complete case management portal with three distinct user experiences: full administrative control for owners and office assistants, limited read-only access with document upload for referral sources, and automated communication keeping all stakeholders informed. The system prioritizes data security by excluding sensitive PII, implements role-based access control, and maintains a complete audit trail. The interface uses the specified brand colors throughout and provides mobile-responsive access from any device. All core functionality including client tracking, attendance monitoring, payment recording, letter generation, and reporting will be production-ready and fully featured.

---

## Questions for clarification:

1. Do you have a business letterhead image file ready to upload, or should the system generate a text-based letterhead using the business name and contact information?

2. For the AI integration using NVIDIA NIM with the z-ai/glm5 model, which specific reports or features should include AI-generated insights beyond standard calculations?

3. Should the system support multiple concurrent programs per client, or is each client enrolled in exactly one program at a time?
