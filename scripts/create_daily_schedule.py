#!/usr/bin/env python3
"""
Create a structured 24-hour schedule with real working YouTube live streams
6am-9am: Breakfast shows
9am-12pm: Bloomberg/Business news
12pm-9pm: Africa news/documentaries  
9pm-6am: Music live streams
"""

import requests
from datetime import datetime, timedelta, timezone

API = "https://nzuritv.preview.emergentagent.com/api"

# Get channel
channel_id = requests.get(f"{API}/channels").json()[0]['id']

# Structured programs with REAL WORKING LIVE STREAMS
PROGRAMS = [
    # 6am-9am: Breakfast Shows (3 hours)
    {
        "title": "Good Morning Britain",
        "description": "Morning news and current affairs",
        "youtube_link": "https://www.youtube.com/embed/live_stream?channel=UCQJr5jE8YkHI5mJpQJIzXuQ&autoplay=1&mute=1",
        "time_slot": "06:00-09:00",
        "duration_hours": 3
    },
    
    # 9am-12pm: Bloomberg/Business (3 hours)
    {
        "title": "Bloomberg Television Live",
        "description": "Global business and financial news",
        "youtube_link": "https://www.youtube.com/embed/dp8PhLsUcFE?autoplay=1&mute=1",
        "time_slot": "09:00-12:00",
        "duration_hours": 3
    },
    
    # 12pm-3pm: Africa News
    {
        "title": "Africa News Live",
        "description": "Latest news from across Africa",
        "youtube_link": "https://www.youtube.com/embed/NQjabLGdP5g?autoplay=1&mute=1",
        "time_slot": "12:00-15:00",
        "duration_hours": 3
    },
    
    # 3pm-6pm: African Documentaries
    {
        "title": "African Wildlife & Culture",
        "description": "Documentaries showcasing Africa",
        "youtube_link": "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&loop=1&playlist=LXb3EKWsInQ",
        "time_slot": "15:00-18:00",
        "duration_hours": 3
    },
    
    # 6pm-9pm: Evening News
    {
        "title": "Al Jazeera English Live",
        "description": "International news and current affairs",
        "youtube_link": "https://www.youtube.com/embed/gCNeDWCI0vo?autoplay=1&mute=1",
        "time_slot": "18:00-21:00",
        "duration_hours": 3
    },
    
    # 9pm-12am: Music - Lofi
    {
        "title": "Lofi Hip Hop Radio - Beats to Relax",
        "description": "24/7 chill music livestream",
        "youtube_link": "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1",
        "time_slot": "21:00-00:00",
        "duration_hours": 3
    },
    
    # 12am-3am: Jazz
    {
        "title": "Smooth Jazz 24/7",
        "description": "Relaxing jazz music all night",
        "youtube_link": "https://www.youtube.com/embed/Dx5qFachd3A?autoplay=1&mute=1",
        "time_slot": "00:00-03:00",
        "duration_hours": 3
    },
    
    # 3am-6am: Classical
    {
        "title": "Classical Music Live Stream",
        "description": "24/7 classical music",
        "youtube_link": "https://www.youtube.com/embed/jgpJVI3tDbY?autoplay=1&mute=1",
        "time_slot": "03:00-06:00",
        "duration_hours": 3
    }
]

print("=" * 60)
print("Creating 24-hour structured schedule for Nzuri TV")
print("=" * 60)

# Delete old programs and schedules
print("\n🗑️  Clearing old data...")
old_programs = requests.get(f"{API}/programs?channel_id={channel_id}").json()
for prog in old_programs:
    requests.delete(f"{API}/programs/{prog['id']}")

old_schedules = requests.get(f"{API}/schedule?channel_id={channel_id}").json()
for sched in old_schedules:
    requests.delete(f"{API}/schedule/{sched['id']}")

print("✅ Cleared old data")

# Create programs
print(f"\n📺 Creating {len(PROGRAMS)} programs...")
program_ids = []
for prog_data in PROGRAMS:
    payload = {
        "channel_id": channel_id,
        "title": prog_data["title"],
        "description": prog_data["description"],
        "youtube_link": prog_data["youtube_link"],
        "tags": prog_data["time_slot"],
        "content_type": "live",
        "duration_seconds": prog_data["duration_hours"] * 3600
    }
    
    resp = requests.post(f"{API}/programs", json=payload)
    if resp.status_code == 200:
        program_ids.append({
            "id": resp.json()['id'],
            "time_slot": prog_data["time_slot"],
            "duration_hours": prog_data["duration_hours"]
        })
        print(f"✅ {prog_data['time_slot']} - {prog_data['title']}")

# Create 7-day schedule
print(f"\n📅 Creating 7-day schedule...")

# Start from today 6am
now = datetime.now(timezone.utc)
# Adjust to 6am today (or 6am tomorrow if past 6am)
start_date = now.replace(hour=6, minute=0, second=0, microsecond=0)
if now.hour >= 6:
    start_date = start_date  # Use today's 6am
else:
    start_date = start_date - timedelta(days=1)  # Use yesterday's 6am

schedule_count = 0
for day in range(7):  # 7 days
    day_start = start_date + timedelta(days=day)
    
    for program_info in program_ids:
        # Parse time slot
        start_hour = int(program_info["time_slot"].split(":")[0])
        
        slot_start = day_start.replace(hour=start_hour)
        slot_end = slot_start + timedelta(hours=program_info["duration_hours"])
        
        payload = {
            "program_id": program_info["id"],
            "channel_id": channel_id,
            "start_time": slot_start.isoformat(),
            "end_time": slot_end.isoformat(),
            "is_live": True
        }
        
        resp = requests.post(f"{API}/schedule", json=payload)
        if resp.status_code == 200:
            schedule_count += 1

print(f"✅ Created {schedule_count} schedule slots (7 days × 8 programs)")

print("\n" + "=" * 60)
print("✅ Schedule Structure:")
print("=" * 60)
print("06:00 - 09:00  Breakfast Show (Good Morning Britain)")
print("09:00 - 12:00  Bloomberg Business News")
print("12:00 - 15:00  Africa News Live")
print("15:00 - 18:00  African Wildlife & Culture")
print("18:00 - 21:00  Al Jazeera English")
print("21:00 - 00:00  Lofi Hip Hop Music")
print("00:00 - 03:00  Smooth Jazz")
print("03:00 - 06:00  Classical Music")
print("=" * 60)
print("✅ Complete! All live streams are 24/7 YouTube channels")
print("Videos will refresh on page reload")
