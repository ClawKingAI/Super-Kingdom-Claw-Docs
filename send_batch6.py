#!/usr/bin/env python3
"""
Deliverance Minister Outreach - Batch 6
Cron-triggered batch send: 15 emails
Time: 2026-03-31 00:28 UTC / 8:28 PM ET March 30
"""

import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
import time
import sys

# Gmail credentials
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_ADDRESS = "david@kingdomlife.site"
EMAIL_PASSWORD = "hazv xpuw wstf cyfd"

# Batch 6 contacts (after Batch 5 which ended with Celina Correa Rodriguez)
BATCH_6_CONTACTS = [
    {"name": "Steve Wease", "email": "priscillawease1983@gmail.com", "location": "Springfield, IL"},
    {"name": "Jacob Chavarin", "email": "elnayuji@gmail.com", "location": "San Diego, CA"},
    {"name": "Nicole Patricio", "email": "im.chosennotforsaken@gmail.com", "location": "Calamba, Philippines"},
    {"name": "Loic Merrot", "email": "loicmerrot@gmail.com", "location": "Bassins, Switzerland"},
    {"name": "Mike Stanford", "email": "teamjesusmosthope20@gmail.com", "location": "Cincinnati, OH"},
    {"name": "Michael and Karen Smith", "email": "mike@hardcorechristianity.com", "location": "Phoenix, AZ"},
    {"name": "Janet Jacinto", "email": "jjpsalm25@yahoo.com", "location": "Monterey, CA"},
    {"name": "Gene Vonda Haddock", "email": "crossroadstahlequah@gmail.com", "location": "Tahlequah, OK"},
    {"name": "Aaron and Chyanne Fonseca", "email": "victorydrivendeliverance@gmail.com", "location": "Brigham City, UT"},
    {"name": "Marcio Alves Batista", "email": "batistamarcio22@hotmail.com", "location": "Oran Park, Australia"},
    {"name": "Rebecca Xavier", "email": "Xavier.rebecca@gmail.com", "location": "Surbiton, UK"},
    {"name": "Steven and Wendy Bumpers", "email": "sbumpers@godsfarm.tv", "location": "Cullman, AL"},
    {"name": "Joshua Andersen", "email": "s2josh@gmail.com", "location": "Pooler, GA"},
    {"name": "Jennifer Heydenreich", "email": "Godzchild.1776@gmail.com", "location": "Stafford, VA"},
    {"name": "James Makinde", "email": "jamesmakinde007@gmail.com", "location": "Lagos, Nigeria"},
]

# Email template (Personal Email - Short & Natural)
def create_email_body(first_name):
    body = f"""Hey {first_name},

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
    return body

# HTML signature
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

def create_html_email(first_name):
    html_body = f"""<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #000000; line-height: 1.6;">
<p>Hey {first_name},</p>

<p>Saw you on the deliverance map and had a quick question.</p>

<p>Do you ever miss people who reach out for prayer at odd hours — like 2am when you're sleeping or in a session?</p>

<p>I built a hybrid chat system that handles those moments. It can run on AI (natural conversation) or pre-built flows — or both together.</p>

<p>Here's an example site I built (deliverance coaching, but I can build any kind):<br>
<a href="https://kingdomlife.site/d1" style="color: #51a7f9;">https://kingdomlife.site/d1</a></p>

<p>See the chat system in action:<br>
<a href="https://ai.kingdomlife.site/aibot" style="color: #51a7f9;">https://ai.kingdomlife.site/aibot</a></p>

<p>No pitch. Just thought it might help what you're building.</p>

<p>— David</p>

{SIGNATURE_HTML}
</body>
</html>
"""
    return html_body

def extract_first_name(full_name):
    """Extract first name from full name field"""
    # Handle couples: "Michael and Karen Smith" -> "Michael"
    # Handle singles: "Steve Wease" -> "Steve"
    name = full_name.split(" and ")[0].strip()
    first = name.split()[0] if name else "there"
    return first

def send_email(to_email, to_name, subject="question about your map pin"):
    """Send a single email"""
    first_name = extract_first_name(to_name)
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['From'] = formataddr(('David Morgan', EMAIL_ADDRESS))
    msg['To'] = to_email
    msg['Subject'] = subject
    
    # Create plain text and HTML versions
    text_body = create_email_body(first_name) + "\n\n" + """David Morgan
FOUNDER | KINGDOM LIFE ASCENSION
✉ David@kingdomlife.site
🌐 ai.kingdomlife.site/1

P.S. I can also create a custom email signature for you like mine — with your social links, branding, and ministry info. Let me know if you'd like one."""
    
    html_body = create_html_email(first_name)
    
    # Attach both versions
    part1 = MIMEText(text_body, 'plain')
    part2 = MIMEText(html_body, 'html')
    msg.attach(part1)
    msg.attach(part2)
    
    # Send
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
    
    return True

def main():
    print("=" * 60)
    print("DELIVERANCE OUTREACH - BATCH 6")
    print("=" * 60)
    print(f"Time: 2026-03-31 00:28 UTC / 8:28 PM ET March 30")
    print(f"Contacts: {len(BATCH_6_CONTACTS)}")
    print("=" * 60)
    
    sent_count = 0
    failed = []
    
    for i, contact in enumerate(BATCH_6_CONTACTS, 1):
        name = contact['name']
        email = contact['email']
        location = contact['location']
        
        print(f"\n[{i}/{len(BATCH_6_CONTACTS)}] Sending to: {name}")
        print(f"    Email: {email}")
        print(f"    Location: {location}")
        
        try:
            send_email(email, name)
            print(f"    ✓ SENT")
            sent_count += 1
            # Small delay between sends to avoid rate limiting
            time.sleep(2)
        except Exception as e:
            print(f"    ✗ FAILED: {e}")
            failed.append({"name": name, "email": email, "error": str(e)})
    
    print("\n" + "=" * 60)
    print("BATCH 6 SUMMARY")
    print("=" * 60)
    print(f"Total attempted: {len(BATCH_6_CONTACTS)}")
    print(f"Successfully sent: {sent_count}")
    print(f"Failed: {len(failed)}")
    
    if failed:
        print("\nFailed emails:")
        for f in failed:
            print(f"  - {f['name']} ({f['email']}): {f['error']}")
    
    print("\n" + "=" * 60)
    print("CUMULATIVE PROGRESS")
    print("=" * 60)
    print("Batch 1: 15 emails (12:09 PM)")
    print("Batch 2: 15 emails (12:44 PM)")
    print("Batch 3: 15 emails (6:55 PM)")
    print("Batch 4: 15 emails (7:27 PM)")
    print("Batch 5: 15 emails (7:59 PM)")
    print(f"Batch 6: {sent_count} emails (8:28 PM)")
    print("-" * 60)
    print(f"Total sent: 75 + {sent_count} = {75 + sent_count} unique contacts")
    print("=" * 60)
    
    return 0 if not failed else 1

if __name__ == "__main__":
    sys.exit(main())
