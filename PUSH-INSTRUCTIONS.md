# Push Instructions

The repository is ready but requires GitHub authentication to push.

## Repository Status

```bash
cd /data/.openclaw/workspace/Super-Kingdom-Claw-Docs
git status
```

## Option 1: GitHub CLI

```bash
# Install GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Login
gh auth login

# Push
git push -u origin main
```

## Option 2: Personal Access Token

```bash
# Create PAT at: https://github.com/settings/tokens
# Required scopes: repo

# Push with token
git remote set-url origin https://<TOKEN>@github.com/ClawKingAI/Super-Kingdom-Claw-Docs.git
git push -u origin main
```

## Option 3: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "kingdom-claw"

# Add to GitHub: https://github.com/settings/keys
cat ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:ClawKingAI/Super-Kingdom-Claw-Docs.git

# Push
git push -u origin main
```

## After Push

The repository will be live at:
https://github.com/ClawKingAI/Super-Kingdom-Claw-Docs
