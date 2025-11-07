# SAI Sports Database Documentation

## Overview
- **Database Name:** sai_sports
- **Database Type:** MySQL / MariaDB 10.11+
- **Character Set:** utf8mb4
- **Collation:** utf8mb4_unicode_ci
- **Storage Engine:** InnoDB

## Connection Details

### Environment Variables
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=sai_sports
```

### Connection String Format
```
mysql+pymysql://root:@localhost:3306/sai_sports
```

## Database Schema

### Table: `contact_messages`

Stores all contact form submissions from the SAI Sports website.

#### Structure
| Column | Type | Null | Key | Description |
|--------|------|------|-----|-------------|
| id | VARCHAR(36) | NO | PRI | UUID primary key |
| name | VARCHAR(255) | NO | | Contact person full name |
| email | VARCHAR(255) | NO | IDX | Contact person email address |
| phone | VARCHAR(50) | YES | | Contact person phone number (optional) |
| message | TEXT | NO | | Message content from contact form |
| timestamp | DATETIME | NO | IDX | Timestamp when message was submitted (UTC) |

#### Indexes
- PRIMARY KEY: `id`
- INDEX: `idx_email` on `email`
- INDEX: `idx_timestamp` on `timestamp`

#### Sample Data
```sql
INSERT INTO contact_messages (id, name, email, phone, message, timestamp)
VALUES (
    'ea78dc7c-f65e-407f-87b0-d8366c22d094',
    'John Doe',
    'john.doe@example.com',
    '+27 82 555 1234',
    'I would like to inquire about athlete representation services.',
    '2025-11-07 12:58:13'
);
```

#### API Endpoints
- **POST** `/api/contact` - Create new contact message
- **GET** `/api/contact` - Retrieve all contact messages

---

### Table: `status_checks`

Stores system status check records for monitoring and health checks.

#### Structure
| Column | Type | Null | Key | Description |
|--------|------|------|-----|-------------|
| id | VARCHAR(36) | NO | PRI | UUID primary key |
| client_name | VARCHAR(255) | NO | IDX | Name of the client/service checking status |
| timestamp | DATETIME | NO | IDX | Timestamp of the status check (UTC) |

#### Indexes
- PRIMARY KEY: `id`
- INDEX: `idx_client_name` on `client_name`
- INDEX: `idx_timestamp` on `timestamp`

#### Sample Data
```sql
INSERT INTO status_checks (id, client_name, timestamp)
VALUES (
    '94f6f6da-be02-4a8b-8cc9-dca16943a0c4',
    'Web Application',
    '2025-11-07 12:00:00'
);
```

#### API Endpoints
- **POST** `/api/status` - Create new status check
- **GET** `/api/status` - Retrieve all status checks

---

## Database Operations

### Import Schema
```bash
mysql -u root -p sai_sports < database_schema.sql
```

### Export Schema Only
```bash
mysqldump -u root -p --no-data sai_sports > schema_export.sql
```

### Export Schema + Data
```bash
mysqldump -u root -p sai_sports > full_backup.sql
```

### Backup Database
```bash
mysqldump -u root -p sai_sports > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
mysql -u root -p sai_sports < backup_file.sql
```

---

## Common Queries

### Get Recent Contact Messages
```sql
SELECT name, email, phone, timestamp 
FROM contact_messages 
ORDER BY timestamp DESC 
LIMIT 10;
```

### Count Messages by Date
```sql
SELECT DATE(timestamp) as date, COUNT(*) as count
FROM contact_messages
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

### Search Messages by Email
```sql
SELECT * FROM contact_messages 
WHERE email LIKE '%@example.com%'
ORDER BY timestamp DESC;
```

### Get Status Checks in Last 24 Hours
```sql
SELECT * FROM status_checks 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY timestamp DESC;
```

### Delete Old Records (Older than 1 year)
```sql
DELETE FROM contact_messages 
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

---

## Maintenance

### Optimize Tables
```sql
OPTIMIZE TABLE contact_messages, status_checks;
```

### Check Table Status
```sql
SHOW TABLE STATUS FROM sai_sports;
```

### Analyze Tables
```sql
ANALYZE TABLE contact_messages, status_checks;
```

### Check Table Structure
```sql
DESCRIBE contact_messages;
DESCRIBE status_checks;
```

---

## Security Notes

1. **Never commit database credentials** to version control
2. Use environment variables for all connection details
3. Implement proper input validation in the application layer
4. Regular backups are recommended (daily)
5. Use prepared statements to prevent SQL injection (already implemented via SQLAlchemy)
6. Consider implementing rate limiting on the contact form endpoint

---

## Performance Tips

1. **Indexes are created on:**
   - Email field (contact_messages) - for searching by email
   - Timestamp fields (both tables) - for time-based queries

2. **For high traffic:**
   - Consider partitioning tables by timestamp
   - Implement caching for read-heavy operations
   - Archive old records periodically

3. **Connection Pooling:**
   - SQLAlchemy connection pool is configured
   - `pool_pre_ping=True` ensures connection validity

---

## Technology Stack

- **ORM:** SQLAlchemy 2.0.44
- **Database Driver:** PyMySQL 1.1.2
- **Backend Framework:** FastAPI
- **Python Version:** 3.11+

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-07 | 1.0.0 | Initial database schema creation |
| 2025-11-07 | 1.0.0 | Migrated from MongoDB to MySQL |
| 2025-11-07 | 1.0.0 | Added indexes for performance optimization |

---

## Contact

For database-related questions or issues:
- **Email:** info@saisports.online
- **Website:** https://saisports.online

---

*Last Updated: November 7, 2025*
