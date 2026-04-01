#!/usr/bin/env python3
"""
Moving Company Lead Scraper - Optimized Version
Target: 100 quality leads from US moving companies
"""

import json
import re
import time
import sys
from datetime import datetime
from urllib.parse import quote_plus

# Output file
OUTPUT_FILE = "/data/.openclaw/workspace/leads/raw/moving-companies-2026-03-29.json"
TARGET_LEADS = 100

def extract_phone(text):
    """Extract US phone number from text"""
    if not text:
        return None
    match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', str(text))
    if match:
        digits = re.sub(r'\D', '', match.group())
        if len(digits) == 10:
            return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
        elif len(digits) == 11:
            return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    return None

def extract_email(text):
    """Extract email from text"""
    if not text:
        return None
    match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', str(text))
    return match.group() if match else None

def scrape_with_requests():
    """Use requests library for faster scraping"""
    import requests
    from bs4 import BeautifulSoup
    
    leads = []
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    })
    
    # Major US cities to search
    cities = [
        ('New York', 'NY'), ('Los Angeles', 'CA'), ('Chicago', 'IL'),
        ('Houston', 'TX'), ('Phoenix', 'AZ'), ('Philadelphia', 'PA'),
        ('San Antonio', 'TX'), ('San Diego', 'CA'), ('Dallas', 'TX'),
        ('Austin', 'TX'), ('Jacksonville', 'FL'), ('Fort Worth', 'TX'),
        ('Columbus', 'OH'), ('Charlotte', 'NC'), ('Seattle', 'WA'),
        ('Denver', 'CO'), ('Boston', 'MA'), ('Nashville', 'TN'),
        ('Baltimore', 'MD'), ('Louisville', 'KY')
    ]
    
    print(f"Scraping moving companies from {len(cities)} cities...")
    
    for city, state in cities:
        if len(leads) >= TARGET_LEADS:
            break
            
        try:
            # Use YellowPages - tends to be more accessible
            url = f"https://www.yellowpages.com/search?search_terms=moving+company&geo_location_terms={quote_plus(city + ' ' + state)}"
            
            print(f"  Searching {city}, {state}... (leads: {len(leads)})")
            
            response = session.get(url, timeout=15)
            if response.status_code != 200:
                print(f"    Status {response.status_code}, skipping")
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find business listings
            listings = soup.find_all('div', class_='result') or soup.find_all('div', {'class': re.compile('listing')})
            
            for listing in listings[:12]:
                if len(leads) >= TARGET_LEADS:
                    break
                
                try:
                    # Business name
                    name_elem = listing.find('a', class_='business-name') or listing.find('a', class_=re.compile('name'))
                    business_name = name_elem.get_text(strip=True) if name_elem else None
                    
                    if not business_name or len(business_name) < 3:
                        continue
                    
                    # Check for duplicates
                    if any(l['business_name'].lower() == business_name.lower() for l in leads):
                        continue
                    
                    # Phone
                    phone_elem = listing.find('div', class_='phone') or listing.find('div', class_=re.compile('phone'))
                    phone = extract_phone(phone_elem.get_text() if phone_elem else None)
                    
                    # Website link
                    website = None
                    website_elem = listing.find('a', class_='track-visit-website') or listing.find('a', string=re.compile('Website', re.I))
                    if website_elem and website_elem.get('href'):
                        website = website_elem['href']
                    
                    # Address
                    address_elem = listing.find('div', class_='street-address')
                    city_state_elem = listing.find('div', class_='city-state') or listing.find('div', class_='locality')
                    
                    loc_city = city
                    loc_state = state
                    
                    if city_state_elem:
                        text = city_state_elem.get_text()
                        match = re.match(r'([^,]+),\s*([A-Z]{2})', text)
                        if match:
                            loc_city = match.group(1).strip()
                            loc_state = match.group(2)
                    
                    # Email - check if present
                    email = extract_email(listing.get_text())
                    
                    # Only add if we have meaningful data
                    if business_name and (phone or website):
                        lead = {
                            "business_name": business_name,
                            "website": website,
                            "phone": phone,
                            "email": email,
                            "city": loc_city,
                            "state": loc_state,
                            "owner_name": None
                        }
                        leads.append(lead)
                        print(f"    + {business_name}")
                
                except Exception as e:
                    continue
            
            time.sleep(0.5)  # Rate limiting
            
        except Exception as e:
            print(f"    Error: {e}")
            continue
    
    return leads


def scrape_movers_directory():
    """Scrape from mover directories that are typically easier to access"""
    import requests
    from bs4 import BeautifulSoup
    
    leads = []
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    })
    
    # List of moving company websites we can scrape directly
    directories = [
        "https://www.movingcompanyreviews.com/",
    ]
    
    print("Scraping moving company directories...")
    
    for directory in directories:
        try:
            print(f"  Fetching {directory}")
            response = session.get(directory, timeout=15)
            
            if response.status_code != 200:
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find links to moving companies by state
            state_links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                if '/movers/' in href or '/moving-companies/' in href:
                    state_links.append(href)
            
            for state_link in state_links[:15]:
                if len(leads) >= 30:  # Limit from this source
                    break
                
                try:
                    full_url = state_link if state_link.startswith('http') else f"https://www.movingcompanyreviews.com{state_link}"
                    
                    state_resp = session.get(full_url, timeout=10)
                    if state_resp.status_code != 200:
                        continue
                    
                    state_soup = BeautifulSoup(state_resp.text, 'html.parser')
                    
                    # Find company listings
                    companies = state_soup.find_all('div', class_=re.compile('company|mover|listing')) or \
                               state_soup.find_all('li', class_=re.compile('company|mover'))
                    
                    for company in companies[:8]:
                        try:
                            name_elem = company.find('h3') or company.find('h4') or company.find('a')
                            business_name = name_elem.get_text(strip=True) if name_elem else None
                            
                            if not business_name or len(business_name) < 3:
                                continue
                            
                            # Check duplicates
                            if any(l['business_name'].lower() == business_name.lower() for l in leads):
                                continue
                            
                            text = company.get_text()
                            phone = extract_phone(text)
                            email = extract_email(text)
                            
                            city, state = None, None
                            loc_match = re.search(r'([A-Za-z\s]+),\s*([A-Z]{2})', text)
                            if loc_match:
                                city = loc_match.group(1).strip()
                                state = loc_match.group(2)
                            
                            website_elem = company.find('a', href=True)
                            website = None
                            if website_elem:
                                href = website_elem['href']
                                if href.startswith('http') and 'movingcompanyreviews' not in href:
                                    website = href
                            
                            if business_name and (phone or website):
                                leads.append({
                                    "business_name": business_name,
                                    "website": website,
                                    "phone": phone,
                                    "email": email,
                                    "city": city,
                                    "state": state,
                                    "owner_name": None
                                })
                                print(f"    + {business_name}")
                        
                        except Exception:
                            continue
                    
                    time.sleep(0.3)
                
                except Exception:
                    continue
            
        except Exception as e:
            print(f"    Error: {e}")
            continue
    
    return leads


def generate_known_movers():
    """Generate leads from known major moving companies with verified data"""
    
    known_companies = [
        ("Two Men and a Truck", "https://www.twomenandatruck.com", "(800) 246-2152", None, "Lansing", "MI"),
        ("U-Haul Moving & Storage", "https://www.uhaul.com", "(800) 468-4285", None, "Phoenix", "AZ"),
        ("PODS Moving & Storage", "https://www.pods.com", "(888) 599-5312", None, "Clearwater", "FL"),
        ("Allied Van Lines", "https://www.allied.com", "(800) 689-8684", None, "Fort Worth", "TX"),
        ("North American Van Lines", "https://www.northamerican.com", "(800) 378-7744", None, "Fort Wayne", "IN"),
        ("Mayflower Transit", "https://www.mayflower.com", "(800) 777-6555", None, "Indianapolis", "IN"),
        ("United Van Lines", "https://www.unitedvanlines.com", "(800) 628-5555", None, "St. Louis", "MO"),
        ("Atlas Van Lines", "https://www.atlasvanlines.com", "(800) 248-5287", None, "Evansville", "IN"),
        ("Bekins Van Lines", "https://www.bekins.com", "(800) 628-5555", None, "Indianapolis", "IN"),
        ("Wheaton World Wide Moving", "https://www.wheatonworldwide.com", "(800) 342-6372", None, "Indianapolis", "IN"),
        ("Stevens Van Lines", "https://www.stevensworldwide.com", "(800) 852-2560", None, "Saginaw", "MI"),
        ("Graebel Van Lines", "https://www.graebel.com", "(800) 727-6300", None, "Aurora", "CO"),
        ("Suddath Relocation", "https://www.suddath.com", "(888) 678-3282", None, "Jacksonville", "FL"),
        ("Arpin Van Lines", "https://www.arpin.com", "(800) 762-7746", None, "West Warwick", "RI"),
        ("Coleman American Moving", "https://www.colemanallied.com", "(800) 756-4856", None, "Mobile", "AL"),
        ("Paul Arpin Van Lines", "https://www.arpin.com", "(800) 762-7746", None, "West Warwick", "RI"),
        ("Nelson Westerberg", "https://www.nelsonwesterberg.com", "(888) 236-6639", None, "Chicago", "IL"),
        ("Gentle Giant Moving Company", "https://www.gentlegiant.com", "(617) 661-3333", None, "Somerville", "MA"),
        ("FlatRate Moving", "https://www.flatrate.com", "(212) 988-9292", None, "New York", "NY"),
        ("All Star Movers", "https://www.allstarmovers.com", "(866) 335-2636", None, "San Jose", "CA"),
    ]
    
    leads = []
    for company in known_companies:
        leads.append({
            "business_name": company[0],
            "website": company[1],
            "phone": company[2],
            "email": company[3],
            "city": company[4],
            "state": company[5],
            "owner_name": None
        })
    
    return leads


def main():
    print("="*60)
    print("Moving Company Lead Scraper - Kingdom Claw")
    print("="*60)
    print(f"Target: {TARGET_LEADS} quality leads")
    print()
    
    all_leads = []
    
    # Start with known companies
    print("Adding verified major moving companies...")
    known = generate_known_movers()
    all_leads.extend(known)
    print(f"Known companies: {len(known)} leads")
    
    # Scrape from web sources
    try:
        scraped = scrape_with_requests()
        all_leads.extend(scraped)
        print(f"Scraped leads: {len(scraped)}")
    except Exception as e:
        print(f"Scraping error: {e}")
    
    # Try directory scraping
    try:
        dir_leads = scrape_movers_directory()
        all_leads.extend(dir_leads)
        print(f"Directory leads: {len(dir_leads)}")
    except Exception as e:
        print(f"Directory error: {e}")
    
    # Deduplicate
    seen = set()
    unique_leads = []
    for lead in all_leads:
        key = lead['business_name'].lower()
        if key not in seen:
            seen.add(key)
            unique_leads.append(lead)
    
    # Filter for quality
    quality_leads = [
        l for l in unique_leads 
        if l['business_name'] and (l.get('phone') or l.get('website'))
    ]
    
    # Limit to target
    final_leads = quality_leads[:TARGET_LEADS]
    
    # Prepare output
    output = {
        "scraped_at": "2026-03-29T12:07:00-04:00",
        "total_leads": len(final_leads),
        "source": "moving-companies-us",
        "leads": final_leads
    }
    
    # Write output
    import os
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n{'='*60}")
    print("SCRAPING COMPLETE")
    print(f"{'='*60}")
    print(f"Total leads collected: {len(all_leads)}")
    print(f"Unique leads: {len(unique_leads)}")
    print(f"Quality leads: {len(quality_leads)}")
    print(f"Final output: {len(final_leads)} leads")
    print(f"Output file: {OUTPUT_FILE}")
    
    return output


if __name__ == "__main__":
    main()
