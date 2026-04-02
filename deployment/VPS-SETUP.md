# VPS Deployment — Complete Guide

> **From Zero to Production** — Step-by-step VPS setup for Kingdom Claw

---

## Prerequisites

### Recommended VPS Specs

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 1 vCPU | 2+ vCPU |
| RAM | 1 GB | 2 GB |
| Storage | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04 | Ubuntu 22.04 LTS |

### Providers

- **Hostinger** — Budget friendly
- **DigitalOcean** — Developer focused
- **Vultr** — Good performance
- **Linode** — Reliable

---

## Step 1: Initial Server Setup

### 1.1 Update System

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update packages
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git nano htop
```

### 1.2 Create User

```bash
# Create openclaw user
useradd -m -s /bin/bash openclaw

# Add to sudo group
usermod -aG sudo openclaw

# Set password
passwd openclaw

# Switch to user
su - openclaw
```

### 1.3 Secure SSH

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Changes:
# Port 22                    # or custom port
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart sshd
```

---

## Step 2: Install Node.js

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # v20.x.x
npm --version   # 10.x.x
```

---

## Step 3: Install OpenClaw

```bash
# Install globally
sudo npm install -g openclaw

# Create directories
mkdir -p ~/.openclaw
mkdir -p /data/.openclaw/workspace

# Verify
openclaw --version
```

---

## Step 4: Install Python (for Skills)

```bash
# Install Python 3.11+
sudo apt install -y python3 python3-pip python3-venv

# Install skill dependencies
pip3 install scrapling playwright

# Install Playwright browsers
playwright install chromium

# Verify
python3 --version
```

---

## Step 5: Configuration

### 5.1 Create Config File

```bash
nano ~/.openclaw/config.yaml
```

### 5.2 Basic Config

```yaml
model:
  provider: nvidia
  model: z-ai/glm5

gateway:
  port: 8080
  bind: 127.0.0.1

channels:
  - provider: telegram
    token: $TELEGRAM_BOT_TOKEN

session:
  persist: true
  maxAge: 7d

logging:
  level: info
  format: json
  output: file
```

### 5.3 Set Environment Variables

```bash
# Create environment file
sudo nano /etc/openclaw/environment

# Add your keys
NVIDIA_API_KEY=your-key-here
TELEGRAM_BOT_TOKEN=your-token-here

# Secure the file
sudo chmod 600 /etc/openclaw/environment
```

---

## Step 6: Install Kingdom Claw Core

### 6.1 Clone Documentation

```bash
cd /data/.openclaw/workspace
git clone https://github.com/ClawKingAI/Super-Kingdom-Claw-Docs.git
```

### 6.2 Install Core

```bash
# Copy core runtime
cp -r Super-Kingdom-Claw-Docs/kingdom-claw-core /data/.openclaw/workspace/

# Install Python dependencies
cd kingdom-claw-core
pip3 install -e .
```

### 6.3 Install Skills

```bash
# Copy skills
cp -r Super-Kingdom-Claw-Docs/skills/* ~/.openclaw/skills/
```

---

## Step 7: Systemd Service

### 7.1 Create Service

```bash
sudo nano /etc/systemd/system/openclaw.service
```

```ini
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
User=openclaw
Group=openclaw
WorkingDirectory=/home/openclaw
Environment="NODE_ENV=production"
EnvironmentFile=/etc/openclaw/environment
ExecStart=/usr/bin/openclaw gateway start
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=10
TimeoutStopSec=30

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/home/openclaw/.openclaw /data/.openclaw

[Install]
WantedBy=multi-user.target
```

### 7.2 Enable Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable at boot
sudo systemctl enable openclaw

# Start
sudo systemctl start openclaw

# Check status
sudo systemctl status openclaw
```

---

## Step 8: Reverse Proxy

### 8.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 8.2 Configure

```bash
sudo nano /etc/nginx/sites-available/openclaw
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8.3 Enable

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

---

## Step 9: SSL Certificate

### 9.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 Get Certificate

```bash
sudo certbot --nginx -d yourdomain.com
```

### 9.3 Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable timer
sudo systemctl enable certbot.timer
```

---

## Step 10: Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

---

## Step 11: Monitoring

### 11.1 Health Check Cron

```bash
sudo crontab -e
```

```
# Health check every 5 minutes
*/5 * * * * curl -sf http://localhost:8080/health || systemctl restart openclaw

# Daily log cleanup
0 2 * * * find /home/openclaw/.openclaw/logs -name "*.log" -mtime +7 -delete
```

### 11.2 Log Viewing

```bash
# Gateway logs
sudo journalctl -u openclaw -f

# Permission audit
tail -f /data/.openclaw/workspace/logs/permission_audit.jsonl
```

---

## Step 12: Backup

### 12.1 Backup Script

```bash
nano /home/openclaw/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backup/openclaw"

mkdir -p $BACKUP_DIR

# Backup config and workspace
tar -czf $BACKUP_DIR/openclaw-$DATE.tar.gz \
    /home/openclaw/.openclaw \
    /data/.openclaw/workspace

# Keep last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### 12.2 Daily Backup

```bash
chmod +x /home/openclaw/backup.sh
sudo crontab -e
```

```
# Backup at 2 AM
0 2 * * * /home/openclaw/backup.sh
```

---

## Verification Checklist

After setup, verify:

```bash
# Check gateway
curl http://localhost:8080/health

# Check service
sudo systemctl status openclaw

# Check logs
sudo journalctl -u openclaw -n 50

# Check config
openclaw config validate

# Check channels
curl https://api.telegram.org/bot<token>/getMe

# Check SSL
curl https://yourdomain.com/health
```

---

## Troubleshooting

### Gateway Won't Start

```bash
# Check logs
sudo journalctl -u openclaw -n 100

# Check config
openclaw config validate

# Check permissions
ls -la ~/.openclaw/
```

### Port in Use

```bash
# Find process
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

### Permission Denied

```bash
# Fix ownership
sudo chown -R openclaw:openclaw ~/.openclaw
sudo chown -R openclaw:openclaw /data/.openclaw

# Fix permissions
chmod -R 755 ~/.openclaw
```

---

## Production Checklist

- [ ] User created with limited permissions
- [ ] SSH hardened (no root login)
- [ ] Firewall enabled
- [ ] SSL certificate installed
- [ ] Systemd service configured
- [ ] Auto-restart on failure
- [ ] Health checks configured
- [ ] Backups scheduled
- [ ] Monitoring enabled
- [ ] Logs rotating

---

## Next Steps

1. [Docker Deployment](DOCKER-DEPLOYMENT.md)
2. [Production Checklist](PRODUCTION-CHECKLIST.md)
3. [Disaster Recovery](DISASTER-RECOVERY.md)
