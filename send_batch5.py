#!/usr/bin/env python3
"""
Deliverance Minister Outreach - Batch 5
Sends 15 emails via Gmail SMTP
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
import ssl

# Gmail SMTP config
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "david@kingdomlife.site"
SENDER_PASSWORD = "hazv xpuw wstf cyfd"  # App password from himalaya config

# Batch 5 contacts (15 emails, starting after Brandon Love)
BATCH_5_CONTACTS = [
    ("Ronald Green", "shortcreekimpact@gmail.com", "Mulga, AL"),
    ("Gisela Badal", "gis74@yahoo.com", "San Antonio, TX"),
    ("Barry and Megan Dykstra", "bdykstra02@gmail.com", "Wyoming, MI"),
    ("Jennifer and Jeffrey Varvar", "jenn.varvar@gmail.com", "Hickman, TN"),
    ("Debra and Phillip Wittenberg", "WeAreSoulsOfThunder@gmail.com", "Savannah, GA"),
    ("Tiffany Hayes", "tiffanyh719@gmail.com", "New Waterford, OH"),
    ("Chery Jenkins", "cheryjenkins7@gmail.com", "Suitland, MD"),
    ("John and Tabatha Hammond", "playin4christ7@yahoo.com", "Fayetteville, AR"),
    ("Cindy Rodriquez", "rodriquezcindy57@gmail.com", "Mesa, AZ"),
    ("Adrian Franco", "adriangfranco5@gmail.com", "Oakland, CA"),
    ("Alex Bemis", "alexbemis1990@gmail.com", "Lafayette, CA"),
    ("Gary and Tracey Mcreynolds", "Info@spiritlifewc.com", "Prince George, VA"),
    ("Petra Singh", "pb12767@hotmail.de", "Ludwigshafen, Germany"),
    ("April McEachern", "kingdomlegacytampa@gmail.com", "Wesley Chapel, FL"),
    ("Celina Correa Rodriguez", "cellz0908@hotmail.com", "Chicopee, MA"),
]

def get_email_body(name):
    """Return the EMAIL 2 template (Personal Email - Short & Natural)"""
    
    html_body = f"""<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #000000; line-height: 1.6;">
<div style="max-width: 600px;">
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

</div>
</body>
</html>"""
    return html_body

def send_email(recipient_name, recipient_email, location):
    """Send a single email"""
    msg = MIMEMultipart('alternative')
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email
    msg['Subject'] = "question about your map pin"
    
    html_body = get_email_body(recipient_name)
    msg.attach(MIMEText(html_body, 'html'))
    
    context = ssl.create_default_context()
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
    
    return True

def main():
    print(f"=== BATCH 5 OUTREACH ===")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Sending {len(BATCH_5_CONTACTS)} emails...")
    print()
    
    success_count = 0
    fail_count = 0
    
    for i, (name, email, location) in enumerate(BATCH_5_CONTACTS, 1):
        try:
            send_email(name, email, location)
            print(f"[{i:2d}] ✓ {name} <{email}> ({location})")
            success_count += 1
        except Exception as e:
            print(f"[{i:2d}] ✗ {name} <{email}> - ERROR: {e}")
            fail_count += 1
    
    print()
    print(f"=== BATCH 5 COMPLETE ===")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Total sent in batch: {len(BATCH_5_CONTACTS)}")
    
    # Update cumulative total
    # Batch 1: 15, Batch 2: 15, Batch 3: 15, Batch 4: 15 = 60 before this
    cumulative = 60 + success_count
    print(f"Cumulative total: {cumulative}")

if __name__ == "__main__":
    main()
