#!/usr/bin/env python3
"""
Batch 10 - Deliverance Minister Outreach Emails
Starting from top of contacts_clean.csv (Aaron Mabon)
15 emails using EMAIL 1 template (Ministry Contact - Most Organic)
Subject: "saw you on isaiah's map" (lowercase)
"""

import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

# Gmail SMTP settings
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "david@kingdomlife.site"
SENDER_NAME = "David Morgan"
APP_PASSWORD = "hazv xpuw wstf cyfd"

# Batch 10 contacts - next 15 from contacts_clean.csv
BATCH_10_CONTACTS = [
    {"name": "Aaron Mabon", "email": "weweaver@gmail.com"},
    {"name": "Adam Dunn", "email": "adamhdunn@gmail.com"},
    {"name": "Akiko Kawahata", "email": "akawahata@att.net"},
    {"name": "Allen Jackson", "email": "ajmail01@comcast.net"},
    {"name": "Allison BALKOVETZ", "email": "1963aaw@gmail.com"},
    {"name": "Aman Malik", "email": "hiaman662@gmail.com"},
    {"name": "Amanda Lane", "email": "adavis152@gmail.com"},
    {"name": "Amber Morris", "email": "ladybugam101@yahoo.com"},
    {"name": "Amy Anderson", "email": "amy155@me.com"},
    {"name": "Amy Delgado", "email": "amy.delgado98@yahoo.com"},
    {"name": "Amy Terlizzi", "email": "amy.terlizzi@gmail.com"},
    {"name": "Ana Acosta", "email": "am.code77@gmail.com"},
    {"name": "Andre Walton", "email": "walt1063@bellsouth.net"},
    {"name": "Andrew Gardner", "email": "agardner64@gmail.com"},
    {"name": "Andrew Halm", "email": "aghalm@yahoo.com"},
]

# Email template - EMAIL 1: Ministry Contact (Most Organic)
SUBJECT = "saw you on isaiah's map"

def get_email_body(name):
    """Generate email body using EMAIL 1 template"""
    first_name = name.split()[0]
    return f"""Hi {first_name},

I came across your ministry on Isaiah Saldivar's deliverance map.

Quick question — do you ever get people reaching out at random hours asking for prayer or help?

I ask because I've been building tools for ministries that handle exactly that. It's a hybrid chat system that can:
- Answer questions 24/7 (AI-powered or pre-built flows)
- Share Scripture with seekers
- Guide people through prayer requests
- Capture info so you can follow up personally

No pressure at all. Just thought it might be useful for what you're doing.

Here's an example of a site I built — this one's for deliverance coaching, but I can build any kind of site you'd want:
https://kingdomlife.site/d1

For more info on the chat system:
https://ai.kingdomlife.site/aibot

Let me know if you'd ever want something like this for your ministry.

Blessings,
David Morgan
"""

def get_html_body(name):
    """Generate HTML email body with signature"""
    first_name = name.split()[0]
    return f"""<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">

<p>Hi {first_name},</p>

<p>I came across your ministry on Isaiah Saldivar's deliverance map.</p>

<p>Quick question — do you ever get people reaching out at random hours asking for prayer or help?</p>

<p>I ask because I've been building tools for ministries that handle exactly that. It's a hybrid chat system that can:</p>
<ul style="margin-left: 20px;">
<li>Answer questions 24/7 (AI-powered or pre-built flows)</li>
<li>Share Scripture with seekers</li>
<li>Guide people through prayer requests</li>
<li>Capture info so you can follow up personally</li>
</ul>

<p>No pressure at all. Just thought it might be useful for what you're doing.</p>

<p>Here's an example of a site I built — this one's for deliverance coaching, but I can build any kind of site you'd want:<br>
<a href="https://kingdomlife.site/d1" style="color: #a37519; font-weight: 700;">https://kingdomlife.site/d1</a></p>

<p>For more info on the chat system:<br>
<a href="https://ai.kingdomlife.site/aibot" style="color: #a37519; font-weight: 700;">https://ai.kingdomlife.site/aibot</a></p>

<p>Let me know if you'd ever want something like this for your ministry.</p>

<p>Blessings,<br>David Morgan</p>

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
    msg["From"] = formataddr((SENDER_NAME, SENDER_EMAIL))
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
    """Send batch 10 emails"""
    print(f"=== BATCH 10: Deliverance Minister Outreach ===")
    print(f"Subject: {SUBJECT}")
    print(f"From: {SENDER_EMAIL}")
    print(f"Total contacts: {len(BATCH_10_CONTACTS)}")
    print()

    success_count = 0
    fail_count = 0
    sent_contacts = []

    for i, contact in enumerate(BATCH_10_CONTACTS, 1):
        name = contact["name"]
        email = contact["email"]
        try:
            print(f"{i}. Sending to {name} <{email}>...")
            send_email(email, name)
            print(f"   ✓ Sent successfully")
            success_count += 1
            sent_contacts.append({"name": name, "email": email})
        except Exception as e:
            print(f"   ✗ FAILED: {e}")
            fail_count += 1

    print()
    print(f"=== BATCH 10 COMPLETE ===")
    print(f"Sent: {success_count}")
    print(f"Failed: {fail_count}")

    # Return summary for memory update
    return {
        "batch": 10,
        "sent": success_count,
        "failed": fail_count,
        "contacts": sent_contacts
    }

if __name__ == "__main__":
    main()
