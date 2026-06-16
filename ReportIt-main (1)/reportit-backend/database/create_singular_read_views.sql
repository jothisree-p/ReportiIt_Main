USE reportit_db;

DROP VIEW IF EXISTS citizen;
DROP VIEW IF EXISTS officer;
DROP VIEW IF EXISTS admin;
DROP VIEW IF EXISTS category;
DROP VIEW IF EXISTS complaint;
DROP VIEW IF EXISTS investigation_note;
DROP VIEW IF EXISTS evidence;
DROP VIEW IF EXISTS notification;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS investigation_note;
DROP TABLE IF EXISTS complaint;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS officer;
DROP TABLE IF EXISTS citizen;
SET FOREIGN_KEY_CHECKS = 1;

CREATE VIEW citizen AS
SELECT
  u.id,
  u.full_name,
  u.email,
  u.phone,
  u.password_hash AS password,
  UPPER(CONCAT(
    LEFT(SUBSTRING_INDEX(TRIM(u.full_name), ' ', 1), 1),
    CASE
      WHEN TRIM(u.full_name) LIKE '% %'
      THEN LEFT(SUBSTRING_INDEX(TRIM(u.full_name), ' ', -1), 1)
      ELSE ''
    END
  )) AS initials,
  u.status,
  u.joined_at AS joined
FROM users u
JOIN roles r ON r.id = u.role_id
WHERE UPPER(r.name) = 'CITIZEN';

CREATE VIEW officer AS
SELECT
  u.id,
  u.full_name AS name,
  COALESCE(o.initials, UPPER(CONCAT(
    LEFT(SUBSTRING_INDEX(TRIM(u.full_name), ' ', 1), 1),
    CASE
      WHEN TRIM(u.full_name) LIKE '% %'
      THEN LEFT(SUBSTRING_INDEX(TRIM(u.full_name), ' ', -1), 1)
      ELSE ''
    END
  ))) AS initials,
  u.email,
  u.password_hash AS password,
  o.badge,
  o.position,
  o.zone,
  o.active_cases AS active_resolved,
  u.status
FROM users u
JOIN roles r ON r.id = u.role_id
LEFT JOIN officers o ON o.user_id = u.id
WHERE UPPER(r.name) = 'OFFICER';

CREATE VIEW admin AS
SELECT
  CAST(u.id AS SIGNED) AS id,
  u.full_name AS username,
  u.email,
  u.password_hash AS password
FROM users u
JOIN roles r ON r.id = u.role_id
WHERE UPPER(r.name) = 'ADMIN';

CREATE VIEW category AS
SELECT
  CAST(id AS SIGNED) AS id,
  name
FROM categories;

CREATE VIEW complaint AS
SELECT
  c.complaint_code AS id,
  c.title,
  c.description,
  c.location_text AS location,
  c.incident_date,
  c.incident_time,
  NULL AS incident_meridian,
  cat.id AS category_id,
  c.priority,
  c.status,
  c.citizen_id,
  c.assigned_officer_id,
  (
    SELECT sh.remark
    FROM status_history sh
    WHERE sh.complaint_id = c.id
    ORDER BY sh.created_at DESC, sh.id DESC
    LIMIT 1
  ) AS last_update,
  c.created_at,
  c.updated_at
FROM complaints c
LEFT JOIN categories cat ON LOWER(cat.name) = LOWER(c.category);

CREATE VIEW investigation_note AS
SELECT
  n.id,
  c.complaint_code AS complaint_id,
  n.note_text AS note,
  n.created_at
FROM complaint_notes n
JOIN complaints c ON c.id = n.complaint_id;

CREATE VIEW evidence AS
SELECT
  f.id,
  c.complaint_code AS complaint_id,
  f.file_name,
  f.file_path,
  f.content_type AS file_type,
  f.uploaded_at
FROM files f
JOIN complaints c ON c.id = f.complaint_id;

CREATE VIEW notification AS
SELECT
  n.id,
  c.complaint_code AS complaint_id,
  n.user_id AS citizen_id,
  n.message,
  n.is_read,
  n.created_at AS sent_at
FROM notifications n
LEFT JOIN complaints c
  ON c.citizen_id = n.user_id
  AND n.message LIKE CONCAT('%', c.complaint_code, '%');
