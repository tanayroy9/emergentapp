# MySQL Setup Guide for Nzuri Digital TV

## Prerequisites
Your web server must have:
- MySQL 5.7+ or MariaDB 10.3+
- Python 3.8+
- pip (Python package manager)

## Step 1: Create MySQL Database

Login to MySQL:
```bash
mysql -u root -p
```

Create database and user:
```sql
CREATE DATABASE nzuri_tv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nzuri_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON nzuri_tv.* TO 'nzuri_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 2: Update Environment Variables

Edit `/app/backend/.env` file:
```bash
# MySQL Configuration
MYSQL_URL=mysql+pymysql://nzuri_user:your_secure_password@localhost:3306/nzuri_tv

# Other settings
JWT_SECRET=nzuritv-secret-key-change-in-production
CORS_ORIGINS=*
```

**Important:** Replace `your_secure_password` with a strong password!

## Step 3: Install MySQL Dependencies

```bash
cd /app/backend
pip install sqlalchemy pymysql alembic
```

## Step 4: Update Supervisor Configuration

The application now uses `server_mysql.py` instead of `server.py`.

Update `/etc/supervisor/conf.d/backend.conf`:
```ini
[program:backend]
command=/root/.venv/bin/uvicorn server_mysql:app --host 0.0.0.0 --port 8001
directory=/app/backend
autostart=true
autorestart=true
```

## Step 5: Restart Services

```bash
sudo supervisorctl reload
```

## Database Schema

The MySQL database will automatically create these tables:

### users
- id (VARCHAR 36, PRIMARY KEY)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- password_hash (VARCHAR 255)
- role (VARCHAR 50)
- created_at (DATETIME)

### channels
- id (VARCHAR 36, PRIMARY KEY)
- name (VARCHAR 255)
- slug (VARCHAR 255, UNIQUE)
- description (TEXT)
- default_embed_url (TEXT)
- created_at (DATETIME)

### programs
- id (VARCHAR 36, PRIMARY KEY)
- channel_id (VARCHAR 36, FOREIGN KEY)
- title (VARCHAR 255)
- description (TEXT)
- tags (VARCHAR 255)
- content_type (VARCHAR 50)
- youtube_link (VARCHAR 1024)
- uploaded_media_path (VARCHAR 1024)
- duration_seconds (INT)
- created_by (VARCHAR 36)
- created_at (DATETIME)

### schedule_items
- id (VARCHAR 36, PRIMARY KEY)
- program_id (VARCHAR 36, FOREIGN KEY)
- channel_id (VARCHAR 36, FOREIGN KEY)
- start_time (DATETIME)
- end_time (DATETIME)
- is_live (BOOLEAN)
- status (VARCHAR 50)
- created_at (DATETIME)
- updated_at (DATETIME)

### tickers
- id (VARCHAR 36, PRIMARY KEY)
- text (TEXT)
- priority (INT)
- active (BOOLEAN)
- created_at (DATETIME)

### ads
- id (VARCHAR 36, PRIMARY KEY)
- title (VARCHAR 255)
- image_url (VARCHAR 1024)
- click_url (VARCHAR 1024)
- priority (INT)
- active (BOOLEAN)
- created_at (DATETIME)

## Admin Account

After setup, create admin account:
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@nzuritv.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## Deployment to Your Web Server

### Option 1: Standard LAMP Stack
1. Copy all files to your web server
2. Set up MySQL database as above
3. Install Python dependencies
4. Run: `uvicorn server_mysql:app --host 0.0.0.0 --port 8001`

### Option 2: cPanel/Plesk
1. Create MySQL database via control panel
2. Upload files via FTP
3. Set up Python app in control panel
4. Configure environment variables

### Option 3: VPS/Cloud
1. Install MySQL: `apt-get install mysql-server`
2. Clone/upload application
3. Set up as systemd service or use supervisor
4. Configure nginx/apache reverse proxy

## Testing MySQL Connection

```bash
python3 -c "
from sqlalchemy import create_engine
engine = create_engine('mysql+pymysql://nzuri_user:password@localhost:3306/nzuri_tv')
print('✅ MySQL connection successful!')
"
```

## Backup & Restore

### Backup
```bash
mysqldump -u nzuri_user -p nzuri_tv > nzuri_tv_backup.sql
```

### Restore
```bash
mysql -u nzuri_user -p nzuri_tv < nzuri_tv_backup.sql
```

## Troubleshooting

### Connection Error
- Check MySQL is running: `systemctl status mysql`
- Verify credentials in .env file
- Check firewall allows MySQL port 3306

### Permission Error
- Verify user has privileges: `SHOW GRANTS FOR 'nzuri_user'@'localhost';`
- Grant privileges again if needed

### Table Not Found
- Tables are created automatically on first run
- Check logs: `tail -f /var/log/supervisor/backend.err.log`

## Migration from MongoDB

If you need to migrate existing data from MongoDB:
1. Export MongoDB data: `mongoexport --db nzuri_tv --collection users --out users.json`
2. Import to MySQL using provided migration script
3. Contact support for migration assistance

## Support

For deployment assistance, contact your hosting provider or system administrator.
