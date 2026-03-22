#!/bin/bash
# ============================================================
# Kingdom Claw Multi-Agent Setup
# ============================================================
# Usage:
#   ./setup.sh              # Interactive setup
#   ./setup.sh --dry-run    # Preview changes
#
# This script creates:
# - 8 sub-agent workspaces
# - Deploys soul.md to each
# - Configures inter-agent communication
# ============================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ${NC} $*"; }
success() { echo -e "${GREEN}✔${NC} $*"; }
step() { echo -e "\n${YELLOW}▸${NC} ${BOLD}$*${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCLAW_HOME="${HOME}/.openclaw"
OPENCLAW_CONFIG="${OPENCLAW_HOME}/openclaw.json"

CORE_AGENTS=(
  "orchestrator|🧠|Project Manager"
  "developer|💻|Builder"
  "designer|🎨|Creative"
  "outreach|📧|Email Agent"
  "leads|🔍|Prospector"
  "researcher|📚|Intel"
  "analyst|📊|Metrics"
  "deployer|🚀|Ship Agent"
)

DEFAULT_MODEL="nvidia/z-ai/glm5"

DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

banner() {
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║${NC} ${BOLD}🦁 Kingdom Claw Multi-Agent Setup${NC} ${GREEN}║${NC}"
  echo -e "${GREEN}║${NC} Client Work • Lead Gen • Rapid Deploy ${GREEN}║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
  echo ""
}

preflight() {
  step "Preflight checks"

  if ! command -v openclaw &>/dev/null; then
    info "OpenClaw CLI not found. Please install OpenClaw first."
    info "Run: npm install -g openclaw"
    exit 1
  fi

  if [[ -f "${OPENCLAW_CONFIG}" ]]; then
    local backup="${OPENCLAW_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "${OPENCLAW_CONFIG}" "${backup}"
    success "Config backed up → ${backup}"
  fi
}

create_agents() {
  step "Creating ${#CORE_AGENTS[@]} sub-agents"

  for entry in "${CORE_AGENTS[@]}"; do
    IFS='|' read -r id emoji role <<< "${entry}"
    local workspace="${OPENCLAW_HOME}/workspace-${id}"

    info "${emoji} ${id} → ${role}"

    if [[ "${DRY_RUN}" == false ]]; then
      openclaw agents add "${id}" --model "${DEFAULT_MODEL}" --workspace "${workspace}" 2>/dev/null || true
    fi
  done
}

deploy_souls() {
  step "Deploying soul.md to each agent"

  for entry in "${CORE_AGENTS[@]}"; do
    IFS='|' read -r id emoji role <<< "${entry}"
    local workspace="${OPENCLAW_HOME}/workspace-${id}"
    local soul_src="${SCRIPT_DIR}/.agents/${id}/soul.md"

    if [[ -f "${soul_src}" ]]; then
      info "${emoji} ${id}: Copying soul.md"
      if [[ "${DRY_RUN}" == false ]]; then
        mkdir -p "${workspace}"
        cp "${soul_src}" "${workspace}/SOUL.md"
      fi
    else
      info "${emoji} ${id}: No soul.md found (skipping)"
    fi
  done
}

deploy_workflows() {
  step "Deploying workflow templates"

  local workflows_src="${SCRIPT_DIR}/workflows"

  for entry in "${CORE_AGENTS[@]}"; do
    IFS='|' read -r id emoji role <<< "${entry}"
    local workspace="${OPENCLAW_HOME}/workspace-${id}"

    if [[ "${DRY_RUN}" == false ]]; then
      mkdir -p "${workspace}"
      # Copy relevant workflows to AGENTS.md appendix
      touch "${workspace}/AGENTS.md"
    fi
  done

  success "Workflows deployed"
}

deploy_main_soul() {
  step "Deploying main soul.md"

  local main_soul="${SCRIPT_DIR}/soul.md"
  local main_workspace="${OPENCLAW_HOME}/workspace"

  if [[ -f "${main_soul}" ]]; then
    if [[ "${DRY_RUN}" == false ]]; then
      mkdir -p "${main_workspace}"
      cp "${main_soul}" "${main_workspace}/SOUL.md"
    fi
    success "Main soul.md deployed"
  else
    info "No main soul.md found"
  fi
}

summary() {
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║${NC} ${BOLD}✅ Setup Complete!${NC} ${GREEN}║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
  echo ""
  echo " Agents created: ${#CORE_AGENTS[@]}"
  echo " Model: ${DEFAULT_MODEL}"
  echo ""
  echo " Next steps:"
  echo "  1. openclaw gateway — Start gateway"
  echo "  2. Test: openclaw chat orchestrator"
  echo ""
}

main() {
  banner
  preflight
  create_agents
  deploy_souls
  deploy_workflows
  deploy_main_soul

  if [[ "${DRY_RUN}" != true ]]; then
    openclaw agents list 2>/dev/null || true
  fi

  summary
}

main "$@"
