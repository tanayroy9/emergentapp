# Nzuri Digital TV - Cloud Hosting Deployment Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Option A: cPanel/Shared Hosting](#option-a-cpanelshared-hosting)
3. [Option B: VPS (DigitalOcean, AWS, Linode)](#option-b-vps-deployment)
4. [Option C: Cloud Platforms (Heroku, Railway)](#option-c-cloud-platforms)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### What You Need:
- ✅ Cloud hosting with **MySQL database** support
- ✅ **Python 3.8+** support
- ✅ **Node.js 14+** for frontend (optional - can use pre-built)
- ✅ Domain name (optional but recommended)

### Files to Deploy:
```
nzuri-tv/
├── backend/              # FastAPI application (MySQL version)
│   ├── server_mysql.py  # Main application file
│   ├── requirements.txt # Python dependencies
│   └── .env            # Configuration (create this)
├── frontend/           # React application
│   └── build/         # Pre-built static files
└── database_exports/  # Database backup files
```

---

## Option A: cPanel/Shared Hosting

### Best For:
- Traditional web hosting (Bluehost, HostGator, Namecheap, etc.)
- Easy setup with web interface
- Budget-friendly ($5-20/month)

### Step-by-Step:

#### 1. Setup MySQL Database

**In cPanel:**
1. Go to **MySQL Databases**
2. Create new database:
   - Database name: `nzuri_tv`
3. Create database user:
   - Username: `nzuri_user`
   - Password: `[strong_password]`
4. Add user to database with **ALL PRIVILEGES**
5. **Note down:**
   - Database host: usually `localhost`
   - Database name: `username_nzuri_tv` (cPanel adds prefix)
   - Username: `username_nzuri_user`
   - Password: your password

#### 2. Import Database

**Option A: Using phpMyAdmin:**
1. Open **phpMyAdmin** in cPanel
2. Select your database
3. Click **Import** tab
4. Upload: `/database_exports/nzuritv_mysql_dump.sql`
5. Click **Go**

**Option B: Using MySQL command:**
```bash
mysql -u username_nzuri_user -p username_nzuri_tv < nzuritv_mysql_dump.sql
```

#### 3. Upload Files

**Via File Manager:**
1. Go to **File Manager** in cPanel
2. Navigate to `public_html` (or subdomain folder)
3. Upload all files:
   ```
   public_html/
   ├── backend/
   ├── frontend/build/  (rename to 'frontend')
   └── .htaccess
   ```

**Via FTP:**
```bash
# Use FileZilla or any FTP client
Host: ftp.yourdomain.com
Username: your_cpanel_username
Password: your_cpanel_password
```

#### 4. Configure Backend

Create `/backend/.env`:
```bash
MYSQL_URL=mysql+pymysql://username_nzuri_user:your_password@localhost:3306/username_nzuri_tv
JWT_SECRET=your-secret-key-change-this
CORS_ORIGINS=https://yourdomain.com,http://yourdomain.com
```

#### 5. Setup Python Application

**In cPanel:**
1. Go to **Setup Python App**
2. Create new application:
   - Python version: 3.8 or higher
   - Application root: `/home/username/public_html/backend`
   - Application URL: `/api`
   - Application startup file: `server_mysql.py`
   - Application Entry point: `app`
3. Add environment variables (from .env file)
4. Click **Create**

#### 6. Install Dependencies

In Python App configuration:
```bash
pip install -r requirements.txt
```

Or via SSH:
```bash
cd ~/public_html/backend
source /home/username/virtualenv/backend/3.8/bin/activate
pip install -r requirements.txt
```

#### 7. Configure .htaccess

Create `/public_html/.htaccess`:
```apache
# Nzuri TV - Apache Configuration

# Enable RewriteEngine
RewriteEngine On

# API Routes - Proxy to Python backend
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^(.*)$ http://127.0.0.1:8001/$1 [P,L]

# Frontend Routes - Serve React app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /frontend/index.html [L]
```

#### 8. Start Application

In Python App interface, click **Restart**

---

## Option B: VPS Deployment

### Best For:
- DigitalOcean, AWS EC2, Linode, Vultr
- Full control over server
- Scalable ($5-50/month)

### Prerequisites:
- Ubuntu 20.04+ or CentOS 7+
- Root/sudo access
- Domain pointed to server IP

### Step-by-Step:

#### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required software
sudo apt install -y python3 python3-pip mysql-server nginx git

# Install Node.js (for building frontend if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 2. Setup MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE nzuri_tv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nzuri_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON nzuri_tv.* TO 'nzuri_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Import Database

```bash
mysql -u nzuri_user -p nzuri_tv < nzuritv_mysql_dump.sql
```

#### 4. Upload Application

**Option A: Git Clone (if you have repo)**
```bash
cd /var/www
sudo git clone https://your-repo-url.git nzuritv
```

**Option B: SCP/SFTP Upload**
```bash
# From your local machine
scp -r /app/* user@your-server-ip:/var/www/nzuritv/
```

#### 5. Setup Backend

```bash
cd /var/www/nzuritv/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
nano .env
```

Add to `.env`:
```bash
MYSQL_URL=mysql+pymysql://nzuri_user:StrongPassword123!@localhost:3306/nzuri_tv
JWT_SECRET=change-this-to-random-secret-key
CORS_ORIGINS=https://yourdomain.com
```

#### 6. Setup Systemd Service

Create `/etc/systemd/system/nzuritv-backend.service`:
```ini
[Unit]
Description=Nzuri TV Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/nzuritv/backend
Environment="PATH=/var/www/nzuritv/backend/venv/bin"
ExecStart=/var/www/nzuritv/backend/venv/bin/uvicorn server_mysql:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable nzuritv-backend
sudo systemctl start nzuritv-backend
sudo systemctl status nzuritv-backend
```

#### 7. Setup Frontend

**If you have pre-built files:**
```bash
cd /var/www/nzuritv
mkdir -p frontend
# Upload build files to /var/www/nzuritv/frontend
```

**If building from source:**
```bash
cd /var/www/nzuritv/frontend
npm install
npm run build
```

#### 8. Configure Nginx

Create `/etc/nginx/sites-available/nzuritv`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - React static files
    location / {
        root /var/www/nzuritv/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy to FastAPI
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static files
    location /static {
        alias /var/www/nzuritv/frontend/build/static;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/nzuritv /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 9. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

---

## Option C: Cloud Platforms

### Heroku Deployment

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create nzuritv

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Deploy
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
```

### Railway Deployment

1. Go to railway.app
2. Click "New Project"
3. Add MySQL database
4. Deploy from GitHub
5. Set environment variables in dashboard

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.8 nzuritv

# Create environment
eb create nzuritv-prod

# Deploy
eb deploy
```

---

## Database Setup

### Export Current Data

```bash
# Run the export script
python3 /app/scripts/create_sql_dump.py

# Files created:
# - /app/database_exports/nzuritv_mysql_dump.sql
# - /app/database_exports/nzuritv_data_export.json
```

### Import to Cloud Database

**MySQL:**
```bash
mysql -h your-host -u your-user -p your-database < nzuritv_mysql_dump.sql
```

**Remote MySQL:**
```bash
mysql -h db.example.com -P 3306 -u nzuri_user -p nzuri_tv < nzuritv_mysql_dump.sql
```

---

## Environment Configuration

### Required Variables

```bash
# Database
MYSQL_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE

# Security
JWT_SECRET=your-random-secret-key-minimum-32-characters

# CORS (comma-separated)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional
DEBUG=False
PORT=8001
```

### Generate Secret Key

```python
import secrets
print(secrets.token_urlsafe(32))
# Copy output to JWT_SECRET
```

---

## Testing

### Test Database Connection

```bash
python3 -c "
from sqlalchemy import create_engine
engine = create_engine('YOUR_MYSQL_URL')
conn = engine.connect()
print('✅ Database connected!')
conn.close()
"
```

### Test Backend

```bash
# Start backend
uvicorn server_mysql:app --host 0.0.0.0 --port 8001

# In another terminal, test API
curl http://localhost:8001/api/channels
```

### Test Frontend

```bash
# Serve frontend
cd frontend/build
python3 -m http.server 3000

# Visit: http://localhost:3000
```

---

## Troubleshooting

### Backend Won't Start

**Check logs:**
```bash
# Systemd service
sudo journalctl -u nzuritv-backend -f

# cPanel
tail -f ~/logs/stderr.log
```

**Common issues:**
- ❌ Wrong MySQL credentials
- ❌ Missing dependencies
- ❌ Port already in use
- ❌ Permission issues

**Solutions:**
```bash
# Test MySQL connection
mysql -h HOST -u USER -p DATABASE

# Install dependencies again
pip install -r requirements.txt --upgrade

# Check port
sudo lsof -i :8001

# Fix permissions
sudo chown -R www-data:www-data /var/www/nzuritv
```

### Database Connection Error

**Error:** `Can't connect to MySQL server`

**Fix:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check user can connect
mysql -u nzuri_user -p nzuri_tv

# Verify MYSQL_URL format:
# mysql+pymysql://username:password@host:port/database
```

### CORS Error

**Error:** `blocked by CORS policy`

**Fix in .env:**
```bash
CORS_ORIGINS=https://yourdomain.com,http://localhost:3000
```

### 502 Bad Gateway (Nginx)

**Check:**
```bash
# Backend is running
curl http://localhost:8001/api/channels

# Nginx config is valid
sudo nginx -t

# Restart both
sudo systemctl restart nzuritv-backend
sudo systemctl restart nginx
```

---

## Post-Deployment Checklist

- [ ] Database imported successfully
- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Can login to admin panel
- [ ] Videos are playing
- [ ] Schedule is showing correctly
- [ ] SSL certificate installed (HTTPS)
- [ ] Backups configured
- [ ] Domain DNS configured correctly
- [ ] Email notifications setup (optional)

---

## Backup & Maintenance

### Daily Backup (Automated)

```bash
#!/bin/bash
# /var/www/nzuritv/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/backups"

# Database backup
mysqldump -u nzuri_user -p'password' nzuri_tv > $BACKUP_DIR/nzuritv_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "nzuritv_*.sql" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /var/www/nzuritv/backup.sh
```

---

## Support & Resources

### Getting Help

1. Check logs first
2. Verify environment variables
3. Test database connection
4. Review nginx/apache config

### Useful Commands

```bash
# Check service status
sudo systemctl status nzuritv-backend

# View logs
sudo journalctl -u nzuritv-backend -f

# Restart services
sudo systemctl restart nzuritv-backend nginx

# Check MySQL
sudo systemctl status mysql
mysql -u nzuri_user -p

# Test API
curl http://localhost:8001/api/channels
```

---

## Cost Estimates

| Provider | Type | Monthly Cost | Good For |
|----------|------|--------------|----------|
| Namecheap | Shared | $5-10 | Small sites |
| DigitalOcean | VPS | $12-24 | Medium sites |
| AWS Lightsail | VPS | $10-40 | Scalable |
| Heroku | Platform | $7-25 | Easy setup |
| Railway | Platform | $5-20 | Modern stack |

---

**Need deployment help? Contact your hosting provider's support or hire a DevOps consultant for $50-200 one-time setup fee.**
