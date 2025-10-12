# Nzuri TV - Online Television Station

## 🎯 Overview

Nzuri TV is a fully functional online television station built with React, FastAPI, and MongoDB. The platform features a complete scheduling system similar to Al Jazeera Live, with real-time content switching, lower-third ticker, and an intuitive admin dashboard.

## ✨ Key Features

### Public Homepage
- **Live Player**: iframe-based video player with YouTube embed support
- **Logo Overlay**: Fixed "NZURI TV" logo in top-right corner (always visible)
- **Now Playing**: Real-time display of current program with description
- **Up Next**: Shows upcoming program
- **Weekly Schedule**: 7-day schedule grid with today highlighted
- **Lower-Third Ticker**: Scrolling breaking news at bottom of screen
- **Weather Widget**: Current weather and 3-day forecast
- **Highlights Section**: Featured stories (Economy, Energy, Mining, Entertainment)
- **Category Links**: Quick navigation by topic

### Admin Dashboard
- **Program Management**: Create programs with YouTube links, descriptions, tags
- **Schedule Management**: Calendar-based scheduling with conflict detection
- **Ticker Management**: Create and manage breaking news tickers with priority
- **Authentication**: Secure login with JWT tokens
- **Real-time Updates**: Changes reflect immediately on homepage

### Backend Scheduler Engine
- **Automatic Status Updates**: Background worker that updates schedule status every 10 seconds
- **Status Transitions**: scheduled → running → completed
- **Now Playing API**: Returns current program, next program, and timing
- **Conflict Detection**: Prevents double-booking of time slots
- **MongoDB Storage**: All data persisted in MongoDB

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + Tailwind CSS + shadcn/ui components
- **Backend**: FastAPI (Python) + Motor (async MongoDB driver)
- **Database**: MongoDB
- **Real-time**: Polling (every 10 seconds for now-playing updates)
- **Authentication**: JWT with bcrypt password hashing

### Key Components

#### Frontend
```
/app/frontend/src/
├── pages/
│   ├── HomePage.jsx          # Main public page
│   ├── Login.jsx              # Auth page
│   └── AdminScheduler.jsx     # Admin dashboard
├── components/
│   ├── Player.jsx             # Video player with logo overlay
│   ├── Ticker.jsx             # Lower-third breaking news
│   ├── Header.jsx             # Navigation header
│   ├── RightSidebar.jsx       # Weather & ads
│   └── ScheduleGrid.jsx       # Weekly schedule display
```

#### Backend
```
/app/backend/
└── server.py                  # Complete FastAPI application
    ├── Auth endpoints         # /api/auth/login, /api/auth/register
    ├── Channel endpoints      # /api/channels
    ├── Program endpoints      # /api/programs
    ├── Schedule endpoints     # /api/schedule, /api/schedule/now-playing
    ├── Ticker endpoints       # /api/ticker
    ├── Ad endpoints           # /api/ads
    └── Scheduler engine       # Background asyncio task
```

## 🚀 Usage Guide

### For Admins

#### 1. Register/Login
- Navigate to https://nzuritv.preview.emergentagent.com/login
- Create an account with email/password
- Login to access admin dashboard

#### 2. Create Programs
- Go to **Programs** tab
- Fill in:
  - **Title**: Program name (e.g., "Morning News - Economy")
  - **Description**: Brief description
  - **YouTube Link**: Use format `https://www.youtube.com/embed/VIDEO_ID`
  - **Content Type**: video, live, or playlist
  - **Duration**: In seconds (e.g., 3600 = 1 hour)
- Click **Create Program**

#### 3. Schedule Programs
- Go to **Schedule** tab
- Select date in calendar
- Click **Add Schedule**
- Select program from dropdown
- Set date, start time, and end time
- Optionally mark as "Live Stream"
- Click **Create Schedule**

#### 4. Manage Tickers
- Go to **Ticker** tab
- Enter breaking news text
- Set priority (1 = highest, 10 = lowest)
- Click **Create Ticker**
- Tickers scroll on homepage bottom

### For Viewers

- Visit https://nzuritv.preview.emergentagent.com/
- Watch live video player
- See current program details below player
- Check weekly schedule
- View breaking news in ticker at bottom

## 📝 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
Body: {"name": "Admin", "email": "admin@example.com", "password": "pass123", "role": "admin"}

# Login
POST /api/auth/login
Body: {"email": "admin@example.com", "password": "pass123"}
Response: {"access_token": "...", "token_type": "bearer", "user": {...}}
```

### Programs
```bash
# Create program
POST /api/programs
Body: {
  "channel_id": "...",
  "title": "Morning News",
  "description": "Daily news",
  "youtube_link": "https://www.youtube.com/embed/VIDEO_ID",
  "content_type": "video",
  "duration_seconds": 3600
}

# Get all programs
GET /api/programs?channel_id=...

# Delete program
DELETE /api/programs/{program_id}
```

### Schedule
```bash
# Create schedule
POST /api/schedule
Body: {
  "program_id": "...",
  "channel_id": "...",
  "start_time": "2025-10-12T14:00:00Z",
  "end_time": "2025-10-12T15:00:00Z",
  "is_live": false
}

# Get schedule
GET /api/schedule?channel_id=...&date=2025-10-12

# Get now playing
GET /api/schedule/now-playing?channel_id=...

# Update schedule
PUT /api/schedule/{schedule_id}
Body: {"status": "cancelled"}

# Delete schedule
DELETE /api/schedule/{schedule_id}
```

### Tickers
```bash
# Create ticker
POST /api/ticker
Body: {"text": "Breaking news text", "priority": 1}

# Get all tickers
GET /api/ticker?active_only=true

# Update ticker
PUT /api/ticker/{ticker_id}

# Delete ticker
DELETE /api/ticker/{ticker_id}
```

## 🔧 Technical Details

### Scheduler Engine Logic

The backend runs a background asyncio task that:
1. Every 10 seconds, queries database for schedule items
2. Updates items where `start_time <= NOW < end_time` to status "running"
3. Updates items where `end_time <= NOW` to status "completed"
4. Frontend polls `/api/schedule/now-playing` every 10 seconds
5. When a new program starts, frontend updates iframe `src` to new YouTube link

### Content Switching Flow

1. Admin creates program with YouTube embed URL
2. Admin schedules program for specific time
3. Background worker detects start time and sets status to "running"
4. Frontend polls now-playing API
5. Frontend receives new program data
6. React component updates Player iframe src
7. Video starts playing automatically

### Data Models

#### User
- id, name, email, password_hash, role, created_at

#### Channel
- id, name, slug, description, default_embed_url, created_at

#### Program
- id, channel_id, title, description, tags, content_type, youtube_link, uploaded_media_path, duration_seconds, created_by, created_at

#### ScheduleItem
- id, program_id, channel_id, start_time, end_time, is_live, status, created_at, updated_at

#### Ticker
- id, text, priority, active, created_at

#### Ad
- id, title, image_url, click_url, priority, active, created_at

## 🎨 Design Features

- **Modern Dark Theme**: Black/gray base with cyan accents
- **Space Grotesk Font**: Clean, modern tech font
- **Responsive Layout**: Desktop and mobile optimized
- **Hover Effects**: Card animations, button transforms
- **Smooth Transitions**: Fade-ins, slide-ups
- **Ticker Animation**: CSS marquee with pause-on-hover
- **Glass-morphism**: Backdrop blur effects on widgets

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens with 24-hour expiration
- Role-based access control (admin/editor)
- MongoDB connection string in environment variable
- CORS configured for allowed origins

## 📊 Database Schema

Collections in MongoDB:
- `users` - Admin accounts
- `channels` - TV channels (Nzuri TV is default)
- `programs` - Video content library
- `schedule_items` - Scheduled broadcasts
- `tickers` - Breaking news items
- `ads` - Advertising content

## 🚦 Status Indicators

### Schedule Status
- **scheduled** (blue): Program is scheduled but not yet started
- **running** (green): Program is currently playing
- **completed** (gray): Program has finished
- **cancelled** (red): Program was cancelled

### Ticker Priority
- 1-3: High priority (breaking news)
- 4-7: Medium priority
- 8-10: Low priority

## 🎥 YouTube Embed Tips

For best results:
1. Use public or unlisted videos (not private)
2. Use embed URL format: `https://www.youtube.com/embed/VIDEO_ID`
3. For live streams: `https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID`
4. Enable autoplay: Add `?autoplay=1` to URL
5. For playlists: `https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID`

## 🔄 Real-time Updates

Current implementation:
- Frontend polls every 10 seconds
- Backend scheduler runs every 10 seconds
- Maximum 10-second delay for content switching

Future enhancement (already structured):
- Server-Sent Events endpoint exists at `/api/stream/updates`
- Can be implemented for true real-time push updates
- Would reduce polling overhead

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 768px (single column, stacked layout)
- **Tablet**: 768px - 1024px (adjusted spacing)
- **Desktop**: > 1024px (two-column layout)

## 🎯 Core Features Summary

✅ **Homepage**: Al Jazeera-style layout with player, sidebar, schedule
✅ **Player**: YouTube iframe with fixed logo overlay
✅ **Ticker**: Lower-third scrolling breaking news
✅ **Scheduler**: Background engine with auto status updates
✅ **Admin Panel**: Complete CRUD for programs, schedules, tickers
✅ **Authentication**: JWT-based login system
✅ **Real-time**: Automatic content switching at scheduled times
✅ **Calendar**: Weekly view with today highlighted
✅ **Conflict Detection**: Prevents schedule overlaps
✅ **Responsive**: Mobile-friendly design

## 🌐 Live Demo

- **Homepage**: https://nzuritv.preview.emergentagent.com/
- **Admin Login**: https://nzuritv.preview.emergentagent.com/login
- **Backend API**: https://nzuritv.preview.emergentagent.com/api/

## 📞 Support

For questions or issues:
1. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
2. Check frontend logs: `tail -f /var/log/supervisor/frontend.err.log`
3. Restart services: `sudo supervisorctl restart all`

---

**Built with ❤️ for Nzuri TV**
