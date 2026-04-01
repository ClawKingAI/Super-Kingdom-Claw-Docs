# Git-Based Project Workflow

## Purpose
Keep the VPS lean by storing all projects in Git. Only active work lives on the VPS.

## Workflow

### Starting New Projects
1. Create repo on GitHub/GitLab first
2. Clone to VPS: `git clone <repo-url> /data/.openclaw/workspace/projects/<name>`
3. Work on project
4. Push regularly

### Completing Projects
1. Final push to repo: `git push origin main`
2. Deploy (here.now, Vercel, etc.)
3. Delete from VPS: `rm -rf /data/.openclaw/workspace/projects/<name>`
4. Project lives in Git, can re-clone anytime

### Re-activating Projects
1. Clone back: `git clone <repo-url> /data/.openclaw/workspace/projects/<name>`
2. Work
3. Delete when done

## Repo Naming Convention
- `kingdom-claw/client-projects/<project-name>` for client work
- `kingdom-claw/landing-pages/<project-name>` for landing pages
- `kingdom-claw/experiments/<project-name>` for tests

## Current Projects to Migrate

### Already Deployed (OK to delete from VPS)
- These are already deployed to here.now
- Delete if not actively working on them

### Needs Git Repo
- Check which projects don't have remotes
- Create repos and push

## Storage Target
- Keep VPS usage under 20 GB
- `projects/` should be < 5 GB at any time
- Delete within 24 hours of deployment

## Automation Opportunity
Future: Script that checks for deployed projects and prompts for cleanup

```bash
#!/bin/bash
# Check for projects older than 7 days with no git activity
find /data/.openclaw/workspace/projects -maxdepth 1 -type d -mtime +7
```

## Backup Strategy
- GitHub is the backup
- No need for local archives
- All work recoverable from Git history
