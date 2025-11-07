# SAI Sports Database - Quick Reference Guide

## 🔌 Connection

```bash
# Connect to database
mysql -u root -p sai_sports

# Via Python
from sqlalchemy import create_engine
engine = create_engine("mysql+pymysql://root:@localhost:3306/sai_sports")
```

## 📊 Tables Overview

### contact_messages
- **Purpose:** Contact form submissions
- **Primary Key:** id (UUID)
- **Indexes:** email, timestamp
- **Size:** ~500 bytes per record

### status_checks
- **Purpose:** System health monitoring
- **Primary Key:** id (UUID)
- **Indexes:** client_name, timestamp
- **Size:** ~100 bytes per record

## 🚀 Quick Commands

### View All Contacts
```sql
SELECT * FROM contact_messages ORDER BY timestamp DESC LIMIT 10;
```

### Count Total Messages
```sql
SELECT COUNT(*) FROM contact_messages;
```

### Today's Messages
```sql
SELECT * FROM contact_messages WHERE DATE(timestamp) = CURDATE();
```

### Search by Email
```sql
SELECT * FROM contact_messages WHERE email = 'example@email.com';
```

### Recent Status Checks
```sql
SELECT * FROM status_checks ORDER BY timestamp DESC LIMIT 5;
```

## 🔧 Maintenance

### Backup
```bash
mysqldump -u root -p sai_sports > backup.sql
```

### Restore
```bash
mysql -u root -p sai_sports < backup.sql
```

### Optimize
```sql
OPTIMIZE TABLE contact_messages, status_checks;
```

### Check Size
```sql
SELECT 
    table_name,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'sai_sports';
```

## 📡 API Endpoints

### Contact Messages
- **POST** `/api/contact` - Submit new message
- **GET** `/api/contact` - Get all messages

### Status Checks
- **POST** `/api/status` - Create status check
- **GET** `/api/status` - Get all status checks

## 🔑 Environment Variables

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=sai_sports
```

## 📈 Common Queries

### Messages This Week
```sql
SELECT COUNT(*) as count, DATE(timestamp) as date
FROM contact_messages
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(timestamp);
```

### Popular Email Domains
```sql
SELECT 
    SUBSTRING_INDEX(email, '@', -1) as domain,
    COUNT(*) as count
FROM contact_messages
GROUP BY domain
ORDER BY count DESC;
```

### Export to CSV
```sql
SELECT * FROM contact_messages
INTO OUTFILE '/tmp/contacts.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

## 🛡️ Security Checklist

- ✅ Use environment variables for credentials
- ✅ Never commit .env files
- ✅ Regular backups (daily recommended)
- ✅ Validate all inputs (Pydantic handles this)
- ✅ Use prepared statements (SQLAlchemy ORM)
- ✅ Implement rate limiting on API endpoints
- ✅ Monitor unusual activity

## 🐛 Troubleshooting

### Can't Connect
```bash
# Check if MariaDB is running
sudo service mariadb status

# Restart MariaDB
sudo service mariadb restart
```

### Permission Denied
```sql
-- Grant privileges
GRANT ALL PRIVILEGES ON sai_sports.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Table Not Found
```bash
# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check tables exist
mysql -u root -p -e "USE sai_sports; SHOW TABLES;"
```

### Import Schema
```bash
mysql -u root -p sai_sports < database_schema.sql
```

## 📞 Support

- **Email:** info@saisports.online
- **Documentation:** /app/DATABASE_DOCUMENTATION.md
- **Schema File:** /app/database_schema.sql
- **ER Diagram:** /app/database_er_diagram.txt

---

*Quick Reference v1.0 | Last Updated: November 7, 2025*
