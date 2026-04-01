#!/usr/bin/env python3
"""
Moving Company Lead Scraper for Kingdom Claw's Outbound Acquisition System
Target: 100 quality leads from US moving companies
"""

import json
import re
import time
from datetime import datetime
from urllib.parse import quote_plus, urljoin
from scrapling.fetchers import StealthyFetcher, Fetcher

# Initialize fetchers
stealthy = StealthyFetcher()
fetcher = Fetcher()

OUTPUT_FILE = "/data/.openclaw/workspace/leads/raw/moving-companies-2026-03-29.json"
TARGET_LEADS = 100

def extract_phone(text):
    """Extract US phone number from text"""
    if not text:
        return None
    # US phone patterns
    patterns = [
        r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\d{3}[-.\s]\d{3}[-.\s]\d{4}',
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            phone = match.group()
            # Normalize to (XXX) XXX-XXXX format
            digits = re.sub(r'\D', '', phone)
            if len(digits) == 10:
                return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
            elif len(digits) == 11 and digits[0] == '1':
                return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    return None

def extract_email(text):
    """Extract email from text"""
    if not text:
        return None
    match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    return match.group() if match else None

def extract_city_state(text):
    """Extract city, state from text"""
    if not text:
        return None, None
    # Pattern for "City, ST" or "City, State"
    patterns = [
        r'([A-Za-z\s]+),\s*([A-Z]{2})\s*\d{5}?',  # City, ST ZIP
        r'([A-Za-z\s]+),\s*([A-Za-z]+)',  # City, State
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            city = match.group(1).strip().title()
            state = match.group(2).strip()
            if len(state) == 2:
                return city, state.upper()
            # Convert full state name to abbreviation
            state_map = {
                'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
                'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
                'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
                'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
                'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
                'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
                'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
                'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
                'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
                'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
                'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
                'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
                'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC'
            }
            return city, state_map.get(state.lower(), state.upper())
    return None, None

def clean_name(name):
    """Clean business name"""
    if not name:
        return None
    # Remove common suffixes for cleaner names
    name = name.strip()
    # Remove trailing LLC, Inc, etc. for owner name extraction later
    return name

def scrape_yelp_leads():
    """Scrape moving companies from Yelp"""
    leads = []
    cities = [
        ('New York', 'NY'), ('Los Angeles', 'CA'), ('Chicago', 'IL'), ('Houston', 'TX'),
        ('Phoenix', 'AZ'), ('Philadelphia', 'PA'), ('San Antonio', 'TX'), ('San Diego', 'CA'),
        ('Dallas', 'TX'), ('San Jose', 'CA'), ('Austin', 'TX'), ('Jacksonville', 'FL'),
        ('Fort Worth', 'TX'), ('Columbus', 'OH'), ('Charlotte', 'NC'), ('San Francisco', 'CA'),
        ('Indianapolis', 'IN'), ('Seattle', 'WA'), ('Denver', 'CO'), ('Boston', 'MA')
    ]
    
    print("Scraping Yelp for moving company leads...")
    
    for city, state in cities[:10]:  # Limit to 10 cities initially
        if len(leads) >= TARGET_LEADS:
            break
            
        try:
            query = quote_plus(f"moving company {city} {state}")
            url = f"https://www.yelp.com/search?find_desc=moving+company&find_loc={city}%2C+{state}"
            
            print(f"  Fetching Yelp: {city}, {state}")
            page = stealthy.fetch(url, headless=True, solve_cloudflare=True, timeout=30)
            
            # Extract business listings
            listings = page.css('div[class*="arrange"]')
            
            for listing in listings[:10]:  # Top 10 per city
                if len(leads) >= TARGET_LEADS:
                    break
                    
                try:
                    # Business name
                    name_elem = listing.css('a[class*="business-name"]')
                    if not name_elem:
                        name_elem = listing.css('h3 a')
                    business_name = name_elem[0].text.strip() if name_elem else None
                    
                    if not business_name or len(business_name) < 3:
                        continue
                    
                    # Phone
                    phone_elem = listing.css('p[class*="phone"]')
                    phone_text = phone_elem[0].text if phone_elem else None
                    phone = extract_phone(phone_text) or extract_phone(listing.html)
                    
                    # Website - need to visit business page
                    business_url = name_elem[0].attr('href') if name_elem else None
                    website = None
                    email = None
                    owner = None
                    
                    if business_url:
                        full_url = urljoin('https://www.yelp.com', business_url)
                        try:
                            biz_page = fetcher.get(full_url, timeout=15)
                            # Get business website
                            website_elem = biz_page.css('a[class*="biz-website"]')
                            if website_elem:
                                website = website_elem[0].attr('href')
                            # Get email from page
                            email = extract_email(biz_page.html)
                        except:
                            pass
                    
                    if business_name and (phone or website):
                        lead = {
                            "business_name": business_name,
                            "website": website,
                            "phone": phone,
                            "email": email,
                            "city": city,
                            "state": state,
                            "owner_name": owner
                        }
                        leads.append(lead)
                        print(f"    + {business_name}")
                    
                    time.sleep(0.5)  # Rate limiting
                    
                except Exception as e:
                    continue
                    
            time.sleep(2)  # Between cities
            
        except Exception as e:
            print(f"  Error with {city}: {e}")
            continue
    
    return leads

def scrape_yellowpages():
    """Scrape moving companies from YellowPages"""
    leads = []
    
    print("Scraping YellowPages for moving company leads...")
    
    states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI']
    
    for state in states[:5]:
        if len(leads) >= TARGET_LEADS // 3:
            break
            
        try:
            url = f"https://www.yellowpages.com/search?search_terms=moving+company&geo_location_terms={state}"
            print(f"  Fetching YellowPages: {state}")
            
            page = stealthy.fetch(url, headless=True, solve_cloudflare=True, timeout=30)
            
            listings = page.css('div[class*="result"]')
            
            for listing in listings[:15]:
                if len(leads) >= TARGET_LEADS // 3:
                    break
                    
                try:
                    # Business name
                    name_elem = listing.css('a[class*="business-name"]')
                    business_name = name_elem[0].text.strip() if name_elem else None
                    
                    if not business_name or len(business_name) < 3:
                        continue
                    
                    # Phone
                    phone_elem = listing.css('div[class*="phone"]')
                    phone = extract_phone(phone_elem[0].text if phone_elem else None)
                    
                    # Website
                    website_elem = listing.css('a[class*="track-visit-website"]')
                    website = website_elem[0].attr('href') if website_elem else None
                    
                    # Address
                    address_elem = listing.css('div[class*="street-address"]')
                    city_state_elem = listing.css('div[class*="city-state"]')
                    
                    city = None
                    st = None
                    if city_state_elem:
                        city, st = extract_city_state(city_state_elem[0].text)
                    
                    if not city:
                        city, st = extract_city_state(listing.html)
                    
                    email = extract_email(listing.html)
                    
                    if business_name and (phone or website):
                        lead = {
                            "business_name": business_name,
                            "website": website,
                            "phone": phone,
                            "email": email,
                            "city": city,
                            "state": st,
                            "owner_name": None
                        }
                        leads.append(lead)
                        print(f"    + {business_name}")
                    
                    time.sleep(0.3)
                    
                except Exception as e:
                    continue
                    
            time.sleep(1.5)
            
        except Exception as e:
            print(f"  Error with {state}: {e}")
            continue
    
    return leads

def scrape_moving_directory():
    """Scrape from moving company directories"""
    leads = []
    
    print("Scraping moving company directories...")
    
    directories = [
        ('https://www.moving.com/moving-companies/', 'div[class*="mover"]'),
        ('https://www.123movers.com/moving-companies/', 'div[class*="listing"]'),
    ]
    
    for base_url, selector in directories[:1]:
        if len(leads) >= TARGET_LEADS // 4:
            break
            
        try:
            print(f"  Fetching: {base_url}")
            page = stealthy.fetch(base_url, headless=True, solve_cloudflare=True, timeout=30)
            
            # Try to find state links
            state_links = page.css('a[href*="/moving-companies/"]')
            
            for link in state_links[:8]:
                if len(leads) >= TARGET_LEADS // 4:
                    break
                    
                state_url = link.attr('href')
                if not state_url:
                    continue
                    
                if not state_url.startswith('http'):
                    state_url = urljoin(base_url, state_url)
                
                try:
                    print(f"    Fetching state page: {state_url}")
                    state_page = fetcher.get(state_url, timeout=20)
                    
                    companies = state_page.css('div[class*="company"], div[class*="mover"], div[class*="listing"]')
                    
                    for company in companies[:10]:
                        try:
                            # Extract company details
                            name_elem = company.css('h3, h4, a[class*="name"]')
                            business_name = name_elem[0].text.strip() if name_elem else None
                            
                            if not business_name or len(business_name) < 3:
                                continue
                            
                            # Try to extract details from the element
                            html_content = company.html
                            phone = extract_phone(html_content)
                            email = extract_email(html_content)
                            city, state = extract_city_state(html_content)
                            
                            # Website link
                            link_elem = company.css('a[href*="http"]')
                            website = None
                            for le in link_elem:
                                href = le.attr('href')
                                if href and 'moving.com' not in href and '123movers' not in href:
                                    website = href
                                    break
                            
                            if business_name and (phone or website):
                                lead = {
                                    "business_name": business_name,
                                    "website": website,
                                    "phone": phone,
                                    "email": email,
                                    "city": city,
                                    "state": state,
                                    "owner_name": None
                                }
                                leads.append(lead)
                                print(f"      + {business_name}")
                            
                        except Exception:
                            continue
                    
                    time.sleep(1)
                    
                except Exception as e:
                    continue
            
        except Exception as e:
            print(f"  Error with {base_url}: {e}")
            continue
    
    return leads

def scrape_bbb():
    """Scrape from Better Business Bureau"""
    leads = []
    
    print("Scraping BBB for moving companies...")
    
    # BBB search URLs by major cities
    cities = [
        ('new-york', 'NY'), ('los-angeles', 'CA'), ('chicago', 'IL'), 
        ('houston', 'TX'), ('phoenix', 'AZ'), ('philadelphia', 'PA')
    ]
    
    for city_slug, state in cities[:4]:
        if len(leads) >= TARGET_LEADS // 4:
            break
            
        try:
            url = f"https://www.bbb.org/search?find_country=USA&find_entity=54433&find_id=1005&find_loc={city_slug}&find_text=moving+company"
            print(f"  Fetching BBB: {city_slug}")
            
            page = stealthy.fetch(url, headless=True, solve_cloudflare=True, timeout=30)
            
            listings = page.css('div[class*="result"], article, li')
            
            for listing in listings[:10]:
                if len(leads) >= TARGET_LEADS // 4:
                    break
                    
                try:
                    name_elem = listing.css('a[class*="business"], h3 a, a[href*="/business-reviews/"]')
                    business_name = name_elem[0].text.strip() if name_elem else None
                    
                    if not business_name or len(business_name) < 3:
                        continue
                    
                    html_content = listing.html
                    phone = extract_phone(html_content)
                    email = extract_email(html_content)
                    city, st = extract_city_state(html_content)
                    
                    # Get website from business page
                    business_link = name_elem[0].attr('href') if name_elem else None
                    website = None
                    
                    if business_link:
                        full_link = urljoin('https://www.bbb.org', business_link)
                        try:
                            biz_page = fetcher.get(full_link, timeout=15)
                            website_elem = biz_page.css('a[href*="http"]:not([href*="bbb.org"])')
                            website = website_elem[0].attr('href') if website_elem else None
                        except:
                            pass
                    
                    if business_name and (phone or website):
                        lead = {
                            "business_name": business_name,
                            "website": website,
                            "phone": phone,
                            "email": email,
                            "city": city,
                            "state": st or state,
                            "owner_name": None
                        }
                        leads.append(lead)
                        print(f"    + {business_name}")
                    
                    time.sleep(0.5)
                    
                except Exception:
                    continue
            
            time.sleep(2)
            
        except Exception as e:
            print(f"  Error with {city_slug}: {e}")
            continue
    
    return leads

def deduplicate_leads(all_leads):
    """Remove duplicate leads based on business name + city"""
    seen = set()
    unique_leads = []
    
    for lead in all_leads:
        key = (lead['business_name'].lower(), lead.get('city', '').lower())
        if key not in seen:
            seen.add(key)
            unique_leads.append(lead)
    
    return unique_leads

def main():
    print("="*60)
    print("Moving Company Lead Scraper - Kingdom Claw")
    print("="*60)
    print(f"Target: {TARGET_LEADS} quality leads")
    print()
    
    all_leads = []
    
    # Scrape from multiple sources
    yelp_leads = scrape_yelp_leads()
    all_leads.extend(yelp_leads)
    print(f"\nYelp leads collected: {len(yelp_leads)}")
    
    yp_leads = scrape_yellowpages()
    all_leads.extend(yp_leads)
    print(f"\nYellowPages leads collected: {len(yp_leads)}")
    
    dir_leads = scrape_moving_directory()
    all_leads.extend(dir_leads)
    print(f"\nDirectory leads collected: {len(dir_leads)}")
    
    bbb_leads = scrape_bbb()
    all_leads.extend(bbb_leads)
    print(f"\nBBB leads collected: {len(bbb_leads)}")
    
    # Deduplicate
    unique_leads = deduplicate_leads(all_leads)
    print(f"\nTotal unique leads before filtering: {len(unique_leads)}")
    
    # Filter for quality - must have business name + at least phone OR website
    quality_leads = [
        lead for lead in unique_leads 
        if lead['business_name'] and (lead['phone'] or lead['website'])
    ]
    
    print(f"Quality leads (have name + phone/website): {len(quality_leads)}")
    
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
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"SCRAPING COMPLETE")
    print(f"{'='*60}")
    print(f"Total leads scraped: {len(all_leads)}")
    print(f"Unique leads: {len(unique_leads)}")
    print(f"Quality leads: {len(quality_leads)}")
    print(f"Final output: {len(final_leads)} leads")
    print(f"Output file: {OUTPUT_FILE}")
    
    return output

if __name__ == "__main__":
    main()
