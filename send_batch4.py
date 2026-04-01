#!/usr/bin/env python3
"""
Deliverance Minister Outreach - Batch 4
Sends 15 emails via Gmail SMTP
Start: Deeann and Sean Bibey (after Batch 3 ended at Alison Simpson)
"""

import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
import json
import os
import sys
from datetime import datetime, timezone

# Gmail SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "david@kingdomlife.site"
APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

# Email content
SUBJECT = "saw you on isaiah's map"

# HTML signature (embedded)
SIGNATURE_HTML = """
<div style="font-size: 26px; font-weight: 800; color: #000000; margin-top: 30px;">David Morgan</div>
<div style="text-transform: uppercase; margin-top: 6px; font-size: 13px; color: #ed5c57; letter-spacing: 2px;">FOUNDER | KINGDOM LIFE ASCENSION</div>
<div style="margin-top: 6px; font-size: 15px;">
<span style="color: #000000;">✉ </span><a href="mailto:David@kingdomlife.site" style="color: #51a7f9; text-decoration: none; margin-left: 8px;">David@kingdomlife.site</a>
</div>
<div style="font-size: 15px;">
<span style="color: #ffffff;">🌐 </span><a href="https://ai.kingdomlife.site/1" style="color: #a37519; text-decoration: none; font-weight: 700; margin-left: 8px;">ai.kingdomlife.site/1</a>
</div>
<div style="margin-top: 22px;">
<a href="https://youtube.com/@davidmorgan2821?si=6E8acxksy1f3a_cD"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="56" height="56" style="margin-right: 14px;"></a>
<a href="https://www.tiktok.com/@davidmorgan306?_t=8p3td3UFc11&_r=1"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" alt="TikTok" width="56" height="56" style="margin-right: 14px;"></a>
<a href="https://www.instagram.com/kingdom_life_site_"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" width="56" height="56" style="margin-right: 14px;"></a>
<a href="https://www.facebook.com/david.mo.554585"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384053.png" alt="Facebook" width="56" height="56"></a>
</div>
<div style="font-size: 12px; color: #6b7280; margin-top: 10px; letter-spacing: 0.6px;">AI Automation • Intelligent Systems • Kingdom-Focused Innovation</div>
<div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 13px; color: #555;">
P.S. I can also create a custom email signature for you like mine — with your social links, branding, and ministry info. Let me know if you'd like one.
</div>
"""

# Batch 4 contacts - Starting from Deeann and Sean Bibey (after Alison Simpson in Batch 3)
BATCH_4_CONTACTS = [
    {"name": "Deeann and Sean Bibey", "email": "Cornerstonefreedomprayer@gmail.com", "location": "North Canton, OH"},
    {"name": "Denise Lugo", "email": "denise.lozada0527@gmail.com", "location": "Palm Bay, FL"},
    {"name": "Boaz and Ashley VanLanen", "email": "bo.vanlanen@gmail.com", "location": "Ooltewah, TN"},
    {"name": "Lorie Nichols", "email": "lorienichols@dmcibb.net", "location": "Hillsdale, MI"},
    {"name": "Richard Hunt", "email": "revivalsa@gmail.com", "location": "Montagu, South Africa"},
    {"name": "Joseph and Autumn Eerdmans", "email": "ajeerdmans@gmail.com", "location": "Allendale, MI"},
    {"name": "Joaquin Betancourt Jr", "email": "renewalchurchtexas@gmail.com", "location": "League City, TX"},
    {"name": "Peter Bowden", "email": "thecowboyevangelist@gmail.com", "location": "Eight Mile Plains, Australia"},
    {"name": "Jennifer and Ruben Martinez", "email": "info@riseupchurchaz.com", "location": "Glendale, AZ"},
    {"name": "Joneida Vega", "email": "jgarcia@rcclife.com", "location": "Aberdeen, MD"},
    {"name": "Cameron and Cindy Howell", "email": "freeinchrist317@gmail.com", "location": "Oregon City, OR"},
    {"name": "Johnny Torres", "email": "jeremiah5120ministries@gmail.com", "location": "Fairhope, AL"},
    {"name": "Jay Achamby", "email": "jay@Bridgechurch.uk", "location": "Sheffield, UK"},
    {"name": "John and Alexandra Tanyan", "email": "truelifechurchinfo@gmail.com", "location": "Pickering, ON, Canada"},
    {"name": "Brandon Love", "email": "brandon@butgodtho.com", "location": "North Charleston, SC"},
]

def get_first_name(full_name):
    """Extract first name from full name"""
    # Handle "Name and Name" format
    if " and " in full_name.lower():
        parts = full_name.split(" and ")
        first = parts[0].split()[0] if parts[0].split() else full_name.split()[0]
        return first
    return full_name.split()[0] if full_name.split() else full_name

def create_email_body(name):
    """Create personalized email body using EMAIL 2 template (personal emails)"""
    first_name = get_first_name(name)
    
    # Use EMAIL 2: Personal Email (Short & Natural)
    body = f"""Hey {first_name},

Saw you on the deliverance map and had a quick question. Do you ever miss people who reach out for prayer at odd hours — like 2am when you're sleeping or in a session?

I built a hybrid chat system that handles those moments. It can run on AI (natural conversation) or pre-built flows — or both together.

Here's an example site I built (deliverance coaching, but I can build any kind): https://kingdomlife.site/d1

See the chat system in action: https://ai.kingdomlife.site/aibot

No pitch. Just thought it might help what you're building.

— David"""
    
    return body

def send_email(recipient_email, recipient_name, dry_run=False):
    """Send a single email"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = formataddr(('David Morgan', SENDER_EMAIL))
        msg['To'] = recipient_email
        msg['Subject'] = SUBJECT
        
        # Create plain text version
        text_body = create_email_body(recipient_name)
        
        # Create HTML version with signature
        html_body = text_body.replace('\n', '<br>\n')
        html_with_signature = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #000000; line-height: 1.6;">
        <div style="white-space: pre-wrap; font-size: 15px;">
{html_body}
</div>
{SIGNATURE_HTML}
        </body>
        </html>
        """
        
        # Attach parts
        part1 = MIMEText(text_body, 'plain')
        part2 = MIMEText(html_with_signature, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        if dry_run:
            print(f"[DRY RUN] Would send to: {recipient_name} <{recipient_email}>")
            return True
        
        # Send via SMTP
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        
        print(f"✓ Sent to: {recipient_name} <{recipient_email}>")
        return True
        
    except Exception as e:
        print(f"✗ Failed for {recipient_name} <{recipient_email}>: {e}")
        return False

def main():
    if not APP_PASSWORD:
        print("ERROR: GMAIL_APP_PASSWORD environment variable not set")
        sys.exit(1)
    
    print(f"\n{'='*60}")
    print(f"DELIVERANCE MINISTER OUTREACH - BATCH 4")
    print(f"Time: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')} UTC")
    print(f"{'='*60}\n")
    
    # Check for dry run mode
    dry_run = "--dry-run" in sys.argv
    
    if dry_run:
        print("DRY RUN MODE - No emails will be sent\n")
    
    sent_count = 0
    failed_count = 0
    results = []
    
    for contact in BATCH_4_CONTACTS:
        success = send_email(contact['email'], contact['name'], dry_run=dry_run)
        if success:
            sent_count += 1
            results.append({
                "name": contact['name'],
                "email": contact['email'],
                "location": contact['location'],
                "status": "sent" if not dry_run else "dry_run"
            })
        else:
            failed_count += 1
            results.append({
                "name": contact['name'],
                "email": contact['email'],
                "location": contact['location'],
                "status": "failed"
            })
    
    print(f"\n{'='*60}")
    print(f"BATCH 4 SUMMARY")
    print(f"{'='*60}")
    print(f"Total attempted: {len(BATCH_4_CONTACTS)}")
    print(f"Sent successfully: {sent_count}")
    print(f"Failed: {failed_count}")
    print(f"{'='*60}\n")
    
    # Print results table
    print("\nEMAILS SENT:")
    print("-" * 70)
    for i, r in enumerate(results, 1):
        status_icon = "✓" if r['status'] in ('sent', 'dry_run') else "✗"
        print(f"| {i:2} | {status_icon} | {r['name'][:30]:30} | {r['email'][:35]:35} |")
    print("-" * 70)
    
    # Update progress tracking
    print(f"\nCUMULATIVE PROGRESS:")
    print(f"  Batch 1: 15 emails (ministry emails)")
    print(f"  Batch 2: 15 emails (personal emails)")
    print(f"  Batch 3: 15 emails (personal emails)")
    print(f"  Batch 4: {sent_count} emails (personal emails)")
    total_sent = 45 + sent_count
    print(f"  TOTAL SENT: {total_sent} unique contacts")
    remaining = 250 - total_sent
    print(f"  Remaining: ~{remaining}+ emails")
    
    # Print next start point
    print(f"\nNEXT BATCH START POINT:")
    next_contact = "Ronald Green (shortcreekimpact@gmail.com)"
    print(f"  Continue from: {next_contact}")

if __name__ == "__main__":
    main()
