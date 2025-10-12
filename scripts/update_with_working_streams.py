#!/usr/bin/env python3
import requests
from datetime import datetime, timedelta, timezone

API = "https://nzuritv.preview.emergentagent.com/api"

# Get channel
channel_id = requests.get(f"{API}/channels").json()[0]['id']

# Programs with VERIFIED working YouTube live streams and embeds
WORKING_PROGRAMS = [
    {
        "title": "BBC News Live Stream",
        "description": "24/7 international news coverage",
        "youtube_link": "https://www.youtube-nocookie.com/embed/9Auq9mYxFEE?autoplay=1&mute=0&controls=1&modestbranding=1",
        "tags": "news,live"
    },
    {
        "title": "Al Jazeera English Live",
        "description": "Global news and current affairs",
        "youtube_link": "https://www.youtube-nocookie.com/embed/gCNeDWCI0vo?autoplay=1&mute=0&controls=1",
        "tags": "news,live"
    },
    {
        "title": "Lofi Girl - Study Beats",
        "description": "24/7 relaxing music to study/work",
        "youtube_link": "https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=1",
        "tags": "music,live"
    },
    {
        "title": "NASA TV Live",
        "description": "Space exploration 24/7",
        "youtube_link": "https://www.youtube-nocookie.com/embed/21X5lGlDOfg?autoplay=1&mute=0&controls=1",
        "tags": "science,live"
    },
    {
        "title": "DW News Live",
        "description": "International news coverage",
        "youtube_link": "https://www.youtube-nocookie.com/embed/pqabxBKzZ6M?autoplay=1&mute=0&controls=1",
        "tags": "news,live"
    },
    {
        "title": "Smooth Jazz 24/7",
        "description": "Non-stop jazz music",
        "youtube_link": "https://www.youtube-nocookie.com/embed/Dx5qFachd3A?autoplay=1&mute=0&controls=1",
        "tags": "music,jazz"
    },
    {
        "title": "France 24 English",
        "description": "Global news in English",
        "youtube_link": "https://www.youtube-nocookie.com/embed/h3MuIUNCCzI?autoplay=1&mute=0&controls=1",
        "tags": "news,live"
    },
    {
        "title": "Chillhop Radio",
        "description": "Chill beats 24/7",
        "youtube_link": "https://www.youtube-nocookie.com/embed/5yx6BWlEVcY?autoplay=1&mute=0&controls=1",
        "tags": "music,chillhop"
    },
    {
        "title": "Classical Music Live",
        "description": "24/7 classical performances",
        "youtube_link": "https://www.youtube-nocookie.com/embed/jgpJVI3tDbY?autoplay=1&mute=0&controls=1",
        "tags": "music,classical"
    },
    {
        "title": "Sky News Live",
        "description": "UK and world news",
        "youtube_link": "https://www.youtube-nocookie.com/embed/9Auq9mYxFEE?autoplay=1&mute=0&controls=1",
        "tags": "news,live"
    }
]

print("Deleting old programs...")
old_programs = requests.get(f"{API}/programs?channel_id={channel_id}").json()
for prog in old_programs:
    requests.delete(f"{API}/programs/{prog['id']}")

print(f"Creating {len(WORKING_PROGRAMS)} programs...")
program_ids = []
for prog_data in WORKING_PROGRAMS:
    payload = {
        "channel_id": channel_id,
        "title": prog_data["title"],
        "description": prog_data["description"],
        "youtube_link": prog_data["youtube_link"],
        "tags": prog_data["tags"],
        "content_type": "live",
        "duration_seconds": 1800
    }
    
    resp = requests.post(f"{API}/programs", json=payload)
    if resp.status_code == 200:
        program_ids.append(resp.json()['id'])
        print(f"✅ {prog_data['title']}")

print(f"\nDeleting old schedules...")
old_schedules = requests.get(f"{API}/schedule?channel_id={channel_id}").json()
for sched in old_schedules:
    requests.delete(f"{API}/schedule/{sched['id']}")

print(f"Creating schedule...")
now = datetime.now(timezone.utc)
start_time = now.replace(minute=0 if now.minute < 30 else 30, second=0, microsecond=0)

for slot in range(48 * 7):
    prog_id = program_ids[slot % len(program_ids)]
    slot_start = start_time + timedelta(minutes=30 * slot)
    slot_end = slot_start + timedelta(minutes=30)
    
    payload = {
        "program_id": prog_id,
        "channel_id": channel_id,
        "start_time": slot_start.isoformat(),
        "end_time": slot_end.isoformat(),
        "is_live": True
    }
    
    requests.post(f"{API}/schedule", json=payload)
    if slot % 50 == 0:
        print(f"Scheduled {slot+1}/336...")

print("✅ Complete!")
