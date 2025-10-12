#!/usr/bin/env python3
"""
Populate Nzuri TV schedule with diverse YouTube content
Running every 30 minutes for the next 7 days
"""

import requests
import json
from datetime import datetime, timedelta, timezone
import sys

BACKEND_URL = "https://nzuritv.preview.emergentagent.com"
API = f"{BACKEND_URL}/api"

# Diverse YouTube content - Real educational, mining, music, sports, news videos
PROGRAMS = [
    # Educational Content
    {
        "title": "TED-Ed: How Does the Stock Market Work",
        "description": "Understanding stock markets and global economy",
        "youtube_link": "https://www.youtube.com/embed/p7HKvqRI_Bo",
        "tags": "education,economy",
        "category": "Education"
    },
    {
        "title": "National Geographic: Earth Science",
        "description": "Exploring our planet's geology and ecosystems",
        "youtube_link": "https://www.youtube.com/embed/T9oNW57dkQ0",
        "tags": "education,science",
        "category": "Education"
    },
    {
        "title": "BBC Learning: World History",
        "description": "Historical documentaries and insights",
        "youtube_link": "https://www.youtube.com/embed/tO01J-M3g0U",
        "tags": "education,history",
        "category": "Education"
    },
    
    # Mining & Resources
    {
        "title": "Mining Technology Innovations",
        "description": "Latest advances in mining technology",
        "youtube_link": "https://www.youtube.com/embed/fGlFCXecghU",
        "tags": "mining,technology",
        "category": "Mining"
    },
    {
        "title": "Gold Mining Operations Documentary",
        "description": "Inside look at modern mining operations",
        "youtube_link": "https://www.youtube.com/embed/Lk9qP369s3g",
        "tags": "mining,documentary",
        "category": "Mining"
    },
    {
        "title": "Diamond Mining in Africa",
        "description": "African diamond mining industry overview",
        "youtube_link": "https://www.youtube.com/embed/VXO0W5m6bOQ",
        "tags": "mining,africa",
        "category": "Mining"
    },
    
    # Music & Entertainment
    {
        "title": "African Music Mix 2025",
        "description": "Latest hits from African artists",
        "youtube_link": "https://www.youtube.com/embed/videoseries?list=PLrEnWoR732-BHrPp_Pm8_VleD68f9s14-",
        "tags": "music,entertainment",
        "category": "Music"
    },
    {
        "title": "Jazz Live Session",
        "description": "Smooth jazz performances",
        "youtube_link": "https://www.youtube.com/embed/Dx5qFachd3A",
        "tags": "music,jazz",
        "category": "Music"
    },
    {
        "title": "Classical Music Concert",
        "description": "Orchestra performances",
        "youtube_link": "https://www.youtube.com/embed/jgpJVI3tDbY",
        "tags": "music,classical",
        "category": "Music"
    },
    {
        "title": "Music Festival Highlights",
        "description": "Best moments from international festivals",
        "youtube_link": "https://www.youtube.com/embed/EJfKUysMpoQ",
        "tags": "music,festival",
        "category": "Entertainment"
    },
    
    # Sports
    {
        "title": "Football Match Highlights",
        "description": "Best goals and plays",
        "youtube_link": "https://www.youtube.com/embed/CnPgA0Bc_Wo",
        "tags": "sports,football",
        "category": "Sports"
    },
    {
        "title": "Olympic Games Recap",
        "description": "Highlights from recent Olympics",
        "youtube_link": "https://www.youtube.com/embed/I8ASH7ltvDc",
        "tags": "sports,olympics",
        "category": "Sports"
    },
    {
        "title": "Cricket World Cup Analysis",
        "description": "Expert commentary and match reviews",
        "youtube_link": "https://www.youtube.com/embed/7Vae_AkLb4Q",
        "tags": "sports,cricket",
        "category": "Sports"
    },
    {
        "title": "Athletics Championship",
        "description": "Track and field competitions",
        "youtube_link": "https://www.youtube.com/embed/gGdz52SL6Sw",
        "tags": "sports,athletics",
        "category": "Sports"
    },
    
    # Green Energy & Environment
    {
        "title": "Solar Power Revolution",
        "description": "Advances in solar energy technology",
        "youtube_link": "https://www.youtube.com/embed/PEe-ZeVbwp8",
        "tags": "green_energy,solar",
        "category": "Green Energy"
    },
    {
        "title": "Wind Energy Farms",
        "description": "How wind turbines power cities",
        "youtube_link": "https://www.youtube.com/embed/nEv_ZGu2r04",
        "tags": "green_energy,wind",
        "category": "Green Energy"
    },
    {
        "title": "Climate Change Solutions",
        "description": "Innovative approaches to environmental challenges",
        "youtube_link": "https://www.youtube.com/embed/EtW2rrLHs08",
        "tags": "green_energy,climate",
        "category": "Green Energy"
    },
    
    # Economy & Business
    {
        "title": "African Economy Report",
        "description": "Economic growth and business opportunities",
        "youtube_link": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "tags": "economy,africa",
        "category": "Economy"
    },
    {
        "title": "Stock Market Analysis",
        "description": "Daily market trends and insights",
        "youtube_link": "https://www.youtube.com/embed/9Auq9mYxFEE",
        "tags": "economy,stocks",
        "category": "Economy"
    },
    {
        "title": "Entrepreneurship Success Stories",
        "description": "Inspiring business journeys",
        "youtube_link": "https://www.youtube.com/embed/5MgBikgcWnY",
        "tags": "economy,business",
        "category": "Economy"
    },
    
    # News & Current Affairs
    {
        "title": "Global News Update",
        "description": "International news highlights",
        "youtube_link": "https://www.youtube.com/embed/w_Ma8oQLmSM",
        "tags": "news,global",
        "category": "News"
    },
    {
        "title": "African News Today",
        "description": "Latest from across the continent",
        "youtube_link": "https://www.youtube.com/embed/gGdz52SL6Sw",
        "tags": "news,africa",
        "category": "News"
    },
    {
        "title": "Tech News Weekly",
        "description": "Latest technology updates",
        "youtube_link": "https://www.youtube.com/embed/VTmF3VBVdZo",
        "tags": "news,technology",
        "category": "News"
    },
    
    # Documentary & Culture
    {
        "title": "African Wildlife Documentary",
        "description": "Exploring Africa's natural wonders",
        "youtube_link": "https://www.youtube.com/embed/LXb3EKWsInQ",
        "tags": "documentary,wildlife",
        "category": "Documentary"
    },
    {
        "title": "Cultural Heritage Series",
        "description": "Preserving traditional cultures",
        "youtube_link": "https://www.youtube.com/embed/UwKqaFPWO3E",
        "tags": "documentary,culture",
        "category": "Documentary"
    }
]

def get_channel_id():
    """Get the first channel ID"""
    try:
        response = requests.get(f"{API}/channels")
        channels = response.json()
        if channels:
            return channels[0]['id']
        return None
    except Exception as e:
        print(f"Error getting channel: {e}")
        return None

def create_programs(channel_id):
    """Create all programs"""
    program_ids = []
    
    for program_data in PROGRAMS:
        try:
            payload = {
                "channel_id": channel_id,
                "title": program_data["title"],
                "description": program_data["description"],
                "youtube_link": program_data["youtube_link"],
                "tags": program_data["tags"],
                "content_type": "video",
                "duration_seconds": 1800  # 30 minutes
            }
            
            response = requests.post(f"{API}/programs", json=payload)
            if response.status_code == 200:
                program = response.json()
                program_ids.append(program['id'])
                print(f"✅ Created: {program_data['title']}")
            else:
                print(f"❌ Failed to create: {program_data['title']}")
                
        except Exception as e:
            print(f"Error creating program {program_data['title']}: {e}")
    
    return program_ids

def create_schedules(channel_id, program_ids):
    """Create 30-minute interval schedules for next 7 days"""
    if not program_ids:
        print("No programs to schedule!")
        return
    
    # Start from now
    current_time = datetime.now(timezone.utc)
    # Round to next 30-minute mark
    minutes = 30 if current_time.minute < 30 else 60
    current_time = current_time.replace(minute=0, second=0, microsecond=0) + timedelta(minutes=minutes)
    
    # Schedule for 7 days (48 slots per day * 7 = 336 slots)
    total_slots = 48 * 7
    program_index = 0
    
    for slot in range(total_slots):
        # Cycle through programs
        program_id = program_ids[program_index % len(program_ids)]
        program_index += 1
        
        start_time = current_time + timedelta(minutes=30 * slot)
        end_time = start_time + timedelta(minutes=30)
        
        try:
            payload = {
                "program_id": program_id,
                "channel_id": channel_id,
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "is_live": False
            }
            
            response = requests.post(f"{API}/schedule", json=payload)
            if response.status_code == 200:
                if slot % 10 == 0:  # Print every 10th schedule
                    print(f"✅ Scheduled slot {slot + 1}/{total_slots}: {start_time.strftime('%Y-%m-%d %H:%M')}")
            else:
                print(f"❌ Failed slot {slot + 1}: {response.text}")
                
        except Exception as e:
            print(f"Error creating schedule slot {slot + 1}: {e}")

def clear_existing_data(channel_id):
    """Clear existing programs and schedules"""
    try:
        # Get all programs
        response = requests.get(f"{API}/programs?channel_id={channel_id}")
        programs = response.json()
        
        print(f"Clearing {len(programs)} existing programs...")
        for program in programs:
            requests.delete(f"{API}/programs/{program['id']}")
        
        # Get all schedules
        response = requests.get(f"{API}/schedule?channel_id={channel_id}")
        schedules = response.json()
        
        print(f"Clearing {len(schedules)} existing schedules...")
        for schedule in schedules:
            requests.delete(f"{API}/schedule/{schedule['id']}")
            
        print("✅ Cleared existing data")
        
    except Exception as e:
        print(f"Error clearing data: {e}")

def main():
    print("🎬 Nzuri TV Schedule Population Script")
    print("=" * 50)
    
    # Get channel
    channel_id = get_channel_id()
    if not channel_id:
        print("❌ No channel found!")
        sys.exit(1)
    
    print(f"✅ Channel ID: {channel_id}")
    
    # Clear existing data
    print("\n🗑️  Clearing existing data...")
    clear_existing_data(channel_id)
    
    # Create programs
    print(f"\n📺 Creating {len(PROGRAMS)} programs...")
    program_ids = create_programs(channel_id)
    print(f"✅ Created {len(program_ids)} programs")
    
    # Create schedules
    print("\n📅 Creating 7-day schedule (30-min intervals)...")
    create_schedules(channel_id, program_ids)
    
    print("\n✅ Schedule population complete!")
    print(f"📊 Total programs: {len(program_ids)}")
    print(f"📊 Total schedule slots: {48 * 7} (7 days × 48 slots/day)")

if __name__ == "__main__":
    main()
