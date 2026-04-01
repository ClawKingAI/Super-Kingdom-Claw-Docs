#!/usr/bin/env python3
"""
Batch 8 - Deliverance Minister Outreach
Subject: saw you on isaiah's map (lowercase)
Continuing from: Daniel Nyambok (slave2jesusinfo@gmail.com)
"""

import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
import time

# Gmail SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "david@kingdomlife.site"
SENDER_PASSWORD = "hazv xpuw wstf cyfd"
SENDER_NAME = "David Morgan"

# Batch 8 contacts (15 emails, continuing from Batch 7)
BATCH_8_CONTACTS = [
    {"name": "Daniel Nyambok", "email": "slave2jesusinfo@gmail.com", "location": "Kista, Sweden"},
    {"name": "Kay Morrison", "email": "kaymorrison1984@gmail.com", "location": "Alabaster, AL"},
    {"name": "Scott Bussey", "email": "scotthbussey@gmail.com", "location": "Oklahoma City, OK"},
    {"name": "Tanya and Joey Sewell", "email": "socialworldmb@gmail.com", "location": "Myrtle Beach, SC"},
    {"name": "Michael Stauffer", "email": "christsfreedomministry@gmail.com", "location": "Edmonton, Canada"},
    {"name": "Joakim Sundbom", "email": "joakim@joakimsundbom.com", "location": "Malmö, Sweden"},
    {"name": "Vilma Arlotti", "email": "Kramliv@gmail.com", "location": "La Verne, CA"},
    {"name": "Andrew Picard", "email": "apicardnasmcpt@yahoo.com", "location": "Lafayette, LA"},
    {"name": "Debra Music", "email": "d_music@comcast.net", "location": "Manteca, CA"},
    {"name": "Ethan Yerges", "email": "ethan.yerges@gmail.com", "location": "Chicago, IL"},
    {"name": "Chaz Brooks", "email": "Abundantlifechurch25@gmail.com", "location": "Samson, AL"},
    {"name": "Pam York", "email": "pamelalyork@yahoo.com", "location": "West Columbia, TX"},
    {"name": "Juan Silva", "email": "revivalinchrist7@gmail.com", "location": "Phoenix, AZ"},
    {"name": "Mario and Erlinda Ortiz", "email": "Blessedman2012@gmail.com", "location": "Phoenix, AZ"},
    {"name": "James and Kerry Christensen", "email": "james.cpa@gmail.com", "location": "Manti, UT"},
]

# Email template - Relationship-First (EMAIL 2: Personal Email - Short & Natural)
def get_email_body(name):
    return f"""Hey {name},

Saw you on the deliverance map and had a quick question. Do you ever miss people who reach out for prayer at odd hours — like 2am when you're sleeping or in a session?

I built a hybrid chat system that handles those moments. It can run on AI (natural conversation) or pre-built flows — or both together.

Here's an example site I built (deliverance coaching, but I can build any kind):
https://kingdomlife.site/d1

See the chat system in action:
https://ai.kingdomlife.site/aibot

No pitch. Just thought it might help what you're building.

— David"""

# HTML email body with signature
def get_html_body(name):
    return f"""<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; color: #000000; line-height: 1.5;">
<p>Hey {name},</p>

<p>Saw you on the deliverance map and had a quick question. Do you ever miss people who reach out for prayer at odd hours — like 2am when you're sleeping or in a session?</p>

<p>I built a hybrid chat system that handles those moments. It can run on AI (natural conversation) or pre-built flows — or both together.</p>

<p>Here's an example site I built (deliverance coaching, but I can build any kind):<br>
<a href="https://kingdomlife.site/d1" style="color: #51a7f9;">https://kingdomlife.site/d1</a></p>

<p>See the chat system in action:<br>
<a href="https://ai.kingdomlife.site/aibot" style="color: #51a7f9;">https://ai.kingdomlife.site/aibot</a></p>

<p>No pitch. Just thought it might help what you're building.</p>

<p>— David</p>

<!-- SIGNATURE -->
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

<!-- P.S. -->
<div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 13px; color: #555;">
P.S. I can also create a custom email signature for you like mine — with your social links, branding, and ministry info. Let me know if you'd like one.
</div>
</body>
</html>"""

def send_email(recipient_email, recipient_name, dry_run=False):
    """Send a single email via Gmail SMTP"""
    
    subject = "saw you on isaiah's map"
    
    # Create message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = formataddr((SENDER_NAME, SENDER_EMAIL))
    msg["To"] = formataddr((recipient_name, recipient_email))
    
    # Attach both plain text and HTML versions
    text_body = get_email_body(recipient_name)
    html_body = get_html_body(recipient_name)
    
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))
    
    if dry_run:
        print(f"[DRY RUN] Would send to: {recipient_name} <{recipient_email}>")
        return True
    
    try:
        # Create SSL context
        context = ssl.create_default_context()
        
        # Connect to Gmail SMTP
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        
        print(f"✓ Sent to: {recipient_name} <{recipient_email}>")
        return True
    
    except Exception as e:
        print(f"✗ Failed to send to {recipient_email}: {e}")
        return False

def main():
    print("=" * 60)
    print("BATCH 8 - Deliverance Minister Outreach")
    print("Subject: saw you on isaiah's map (lowercase)")
    print("=" * 60)
    print()
    
    success_count = 0
    fail_count = 0
    
    for i, contact in enumerate(BATCH_8_CONTACTS, 1):
        print(f"[{i}/15] Sending to {contact['name']} ({contact['location']})...")
        
        if send_email(contact["email"], contact["name"]):
            success_count += 1
        else:
            fail_count += 1
        
        # Rate limiting: wait 2 seconds between sends
        if i < len(BATCH_8_CONTACTS):
            time.sleep(2)
    
    print()
    print("=" * 60)
    print(f"BATCH 8 COMPLETE")
    print(f"  Success: {success_count}")
    print(f"  Failed: {fail_count}")
    print("=" * 60)
    
    # Update cumulative progress
    total_sent = 105 + success_count  # Previous batches + this batch
    print(f"\nCUMULATIVE PROGRESS:")
    print(f"  Total emails sent: {total_sent}")
    print(f"  Remaining: ~{250 - total_sent}+")
    print()

if __name__ == "__main__":
    main()
