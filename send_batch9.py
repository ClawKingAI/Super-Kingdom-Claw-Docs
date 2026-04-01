#!/usr/bin/env python3
"""Batch 9 - Deliverance Minister Outreach Emails
Starting from Charles and Sheeba Chandy (after James and Kerry Christensen)
15 emails using EMAIL 2 template (Personal Email - Short & Natural)
"""

import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# Gmail SMTP settings
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "david@kingdomlife.site"

# App password from himalaya config
APP_PASSWORD = "hazv xpuw wstf cyfd"

# Batch 9 contacts - starting after James and Kerry Christensen
BATCH_9_CONTACTS = [
    {"name": "Charles and Sheeba Chandy", "email": "charlesjaico@gmail.com", "location": "Warren, MI"},
    {"name": "Christopher Silva", "email": "chrisnsilva@yahoo.com", "location": "Brawley, CA"},
    {"name": "June and Bianca Muniz", "email": "candidomuniz505@gmail.com", "location": "Artesia, NM"},
    {"name": "Rosalind Derrick", "email": "rosalindderrick@gmail.com", "location": "Nashville, TN"},
    {"name": "Corey Johnston", "email": "Coreyj704518@gmail.com", "location": "Locust, NC"},
    {"name": "Pastor Rob and Sherri Walters", "email": "freedomandhealingministry@gmail.com", "location": "Parkville, MD"},
    {"name": "Victoria Heacock", "email": "vicmar@live.ca", "location": "Kawartha Lakes, Canada"},
    {"name": "Joseph Wickey", "email": "joewickey28@myyahoo.com", "location": "Cameron, OK"},
    {"name": "Autumn Cozart", "email": "autumnajnatalie@gmail.com", "location": "Indianapolis, IN"},
    {"name": "Isaiah Trevino", "email": "ezdrumz365@gmail.com", "location": "Weslaco, TX"},
    {"name": "Joshua Jefferies", "email": "Tyquan143@yahoo.com", "location": "Bronx, NY"},
    {"name": "Manuel Chavez", "email": "friendofjesus1980@gmail.com", "location": "Fresno, CA"},
    {"name": "Amanda and Rudy Cortez", "email": "mamacortez23@gmail.com", "location": "Loomis, CA"},
    {"name": "Tabitha Coston", "email": "tabithacoston@yahoo.com", "location": "New Haven, IL"},
    {"name": "Kaiesha Stewart", "email": "Kaieshastewart20@gmail.com", "location": "Lancaster, PA"},
]

# Email template - EMAIL 2: Personal Email (Short & Natural)
SUBJECT = "saw you on isaiah's map"

def get_email_body(name):
    """Generate email body using EMAIL 2 template"""
    first_name = name.split()[0]
    if " and " in name:
        first_name = name.split(" and ")[0]
    
    return f"""Hey {first_name},

Saw you on the deliverance map and had a quick question.

Do you ever miss people who reach out for prayer at odd hours — like 2am when you're sleeping or in a session?

I built a hybrid chat system that handles those moments. It can run on AI (natural conversation) or pre-built flows — or both together.

Here's an example site I built (deliverance coaching, but I can build any kind):
https://kingdomlife.site/d1

See the chat system in action:
https://ai.kingdomlife.site/aibot

No pitch. Just thought it might help what you're building.

— David
"""

def get_html_body(name):
    """Generate HTML email body with signature"""
    first_name = name.split()[0]
    if " and " in name:
        first_name = name.split(" and ")[0]
    
    return f"""<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">

<p>Hey {first_name},</p>

<p>Saw you on the deliverance map and had a quick question.</p>

<p>Do you ever miss people who reach out for prayer at odd hours — like 2am when you're sleeping or in a session?</p>

<p>I built a hybrid chat system that handles those moments. It can run on AI (natural conversation) or pre-built flows — or both together.</p>

<p>Here's an example site I built (deliverance coaching, but I can build any kind):<br>
<a href="https://kingdomlife.site/d1" style="color: #a37519; font-weight: 700;">https://kingdomlife.site/d1</a></p>

<p>See the chat system in action:<br>
<a href="https://ai.kingdomlife.site/aibot" style="color: #a37519; font-weight: 700;">https://ai.kingdomlife.site/aibot</a></p>

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
</html>
"""

def send_email(to_email, to_name):
    """Send a single email"""
    context = ssl.create_default_context()
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = SUBJECT
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    
    # Add both plain text and HTML versions
    plain_text = get_email_body(to_name)
    html_text = get_html_body(to_name)
    
    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(html_text, "html"))
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
    
    return True

def main():
    """Send batch 9 emails"""
    print(f"=== BATCH 9: Deliverance Minister Outreach ===")
    print(f"Subject: {SUBJECT}")
    print(f"From: {SENDER_EMAIL}")
    print(f"Total contacts: {len(BATCH_9_CONTACTS)}")
    print()
    
    success_count = 0
    fail_count = 0
    
    for i, contact in enumerate(BATCH_9_CONTACTS, 1):
        name = contact["name"]
        email = contact["email"]
        location = contact["location"]
        
        try:
            print(f"{i}. Sending to {name} <{email}> ({location})...")
            send_email(email, name)
            print(f"   ✓ Sent successfully")
            success_count += 1
        except Exception as e:
            print(f"   ✗ FAILED: {e}")
            fail_count += 1
    
    print()
    print(f"=== BATCH 9 COMPLETE ===")
    print(f"Sent: {success_count}")
    print(f"Failed: {fail_count}")
    
    # Return summary for memory update
    return {
        "batch": 9,
        "sent": success_count,
        "failed": fail_count,
        "contacts": BATCH_9_CONTACTS
    }

if __name__ == "__main__":
    main()
