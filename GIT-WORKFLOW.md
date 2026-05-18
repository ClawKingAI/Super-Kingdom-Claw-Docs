# GIT-WORKFLOW.md — Project Lifecycle

## Purpose
Keep the VPS lean by storing all projects in Git. Only active work lives on the server.

## Workflow

### Starting New Projects
1. Create repo on GitHub/GitLab first
2. Clone to workspace
3. Work on project
4. Push regularly

### Completing Projects
1. Final push to repo
2. Deploy (here.now, Vercel, etc.)
3. Remove from workspace
4. Project lives in Git — re-clone anytime

### Re-activating Projects
1. Clone back from repo
2. Work
3. Remove when done

## Naming Convention
- `kingdom-claw/client-projects/<name>` for client work
- `kingdom-claw/landing-pages/<name>` for landing pages
- `kingdom-claw/experiments/<name>` for tests

## Storage Target
- Keep workspace usage lean
- Active projects should be minimal at any time
- Delete within 24 hours of deployment

## Backup Strategy
- Git is the backup
- All work recoverable from Git history
