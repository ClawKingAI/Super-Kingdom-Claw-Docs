# 📋 Workflow: Client Project Pipeline

---

## Overview

Complete workflow for delivering client projects from intake to handoff.

**Total Time:** 1-5 days depending on complexity

---

## Phase 0: Intake (Orchestrator)

**Owner:** Orchestrator
**Duration:** 30 min - 2 hours

### Tasks
1. Receive project request from human
2. Ask clarifying questions:
   - What is the deliverable?
   - What is the timeline?
   - What is the budget (if applicable)?
   - Any technical constraints?
   - Brand guidelines/assets available?
3. Create project brief
4. Save to `/data/.openclaw/workspace/projects/{project-name}/BRIEF.md`

### Output
- Project brief document
- Clear scope definition

---

## Phase 1: Planning (Orchestrator + Developer)

**Owner:** Orchestrator → Developer
**Duration:** 30 min - 1 hour

### Tasks
1. Orchestrator assigns to Developer
2. Developer reviews brief
3. Developer proposes:
   - Tech stack (default: React + Tailwind + Vite)
   - Architecture decisions
   - Task breakdown
4. Orchestrator approves or requests changes

### Output
- Architecture decisions
- Task breakdown
- Timeline with milestones

---

## Phase 2: Build (Developer + Designer)

**Owner:** Developer
**Duration:** 2 hours - 3 days

### Tasks
1. Developer scaffolds project
2. Developer builds core features
3. Designer applies styling (if complex)
4. Developer implements all requirements
5. Self-review against brief

### Output
- Functional application
- All core features working

---

## Phase 3: Review (Orchestrator)

**Owner:** Orchestrator
**Duration:** 30 min

### Tasks
1. Orchestrator reviews against brief
2. Test all features
3. Check mobile responsiveness
4. Verify requirements met
5. Approve or request changes

### Output
- Approved build, OR
- Change request list

---

## Phase 4: Deploy (Deployer)

**Owner:** Deployer
**Duration:** 5-15 min

### Tasks
1. Run `npm run build`
2. Check build passes
3. Deploy to here.now
4. Verify live URL works
5. Return URL to Orchestrator

### Output
- Live URL
- Deployment confirmation

---

## Phase 5: Handoff (Orchestrator)

**Owner:** Orchestrator
**Duration:** 30 min - 1 hour

### Tasks
1. Prepare handoff package:
   - Source code location
   - Live URL
   - Documentation
   - Credentials (if applicable)
2. Deliver to human
3. Confirm receipt

### Output
- Complete handoff documentation
- Client has everything needed

---

## Quality Gates

| Phase | Gate | Criteria |
|-------|------|----------|
| 0→1 | Brief approved | Clear scope, timeline, deliverables |
| 1→2 | Architecture approved | Tech stack, task breakdown |
| 2→3 | Build complete | All features working |
| 3→4 | Review passed | Requirements met |
| 4→5 | Deploy success | Live URL works |
| 5→Done | Handoff delivered | Human confirms receipt |

---

## Timeline Examples

| Project Type | Typical Duration |
|--------------|------------------|
| Landing Page | 2-4 hours |
| Marketing Site | 1-2 days |
| Web Application | 3-5 days |
| Complex Platform | 1-2 weeks |

---

## Failure Handling

| Failure | Recovery |
|---------|----------|
| Build fails | Developer fixes, retries |
| Deploy fails | Deployer checks error, retries once |
| Requirements not met | Back to Phase 2 |
| Timeline at risk | Notify human immediately |
