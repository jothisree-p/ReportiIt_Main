CREATE DATABASE IF NOT EXISTS reportit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reportit_db;

CREATE TABLE IF NOT EXISTS citizen (
  id BIGINT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  initials VARCHAR(5) NOT NULL,
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  joined DATE NOT NULL DEFAULT (CURRENT_DATE),
  CONSTRAINT pk_citizen PRIMARY KEY (id),
  CONSTRAINT uq_citizen_email UNIQUE (email),
  CONSTRAINT chk_citizen_phone CHECK (phone REGEXP '^[0-9+ -]{10,20}$'),
  CONSTRAINT chk_citizen_email CHECK (email REGEXP '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$')
);

CREATE TABLE IF NOT EXISTS officer (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  initials VARCHAR(5) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  badge VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  zone VARCHAR(100),
  active_resolved VARCHAR(20),
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  CONSTRAINT pk_officer PRIMARY KEY (id),
  CONSTRAINT uq_officer_email UNIQUE (email),
  CONSTRAINT uq_officer_badge UNIQUE (badge),
  CONSTRAINT chk_officer_email CHECK (email REGEXP '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$')
);

CREATE TABLE IF NOT EXISTS admin (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  CONSTRAINT pk_admin PRIMARY KEY (id),
  CONSTRAINT uq_admin_username UNIQUE (username),
  CONSTRAINT uq_admin_email UNIQUE (email),
  CONSTRAINT chk_admin_email CHECK (email REGEXP '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$')
);

CREATE TABLE IF NOT EXISTS category (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  CONSTRAINT pk_category PRIMARY KEY (id),
  CONSTRAINT uq_category_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS complaint (
  id VARCHAR(20) NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(500) NOT NULL,
  incident_date DATE NOT NULL,
  incident_time VARCHAR(10),
  incident_meridian ENUM('AM', 'PM') DEFAULT 'AM',
  category_id INT NOT NULL,
  priority ENUM('Pending', 'Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Pending',
  status ENUM('Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected') NOT NULL DEFAULT 'Pending',
  citizen_id BIGINT NOT NULL,
  assigned_officer_id BIGINT,
  last_update TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_complaint PRIMARY KEY (id),
  CONSTRAINT fk_complaint_category FOREIGN KEY (category_id)
    REFERENCES category(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_complaint_citizen FOREIGN KEY (citizen_id)
    REFERENCES citizen(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_complaint_officer FOREIGN KEY (assigned_officer_id)
    REFERENCES officer(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS investigation_note (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id VARCHAR(20) NOT NULL,
  note TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_investigation_note PRIMARY KEY (id),
  CONSTRAINT fk_investigation_note_complaint FOREIGN KEY (complaint_id)
    REFERENCES complaint(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS evidence (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id VARCHAR(20) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(100),
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_evidence PRIMARY KEY (id),
  CONSTRAINT fk_evidence_complaint FOREIGN KEY (complaint_id)
    REFERENCES complaint(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS notification (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id VARCHAR(20) NOT NULL,
  citizen_id BIGINT NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_notification PRIMARY KEY (id),
  CONSTRAINT fk_notification_complaint FOREIGN KEY (complaint_id)
    REFERENCES complaint(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_notification_citizen FOREIGN KEY (citizen_id)
    REFERENCES citizen(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS complaint_feedback (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT NOT NULL,
  citizen_id BIGINT NOT NULL,
  officer_id BIGINT,
  rating INT NOT NULL,
  comment TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_complaint_feedback PRIMARY KEY (id),
  CONSTRAINT uq_feedback_complaint_citizen UNIQUE (complaint_id, citizen_id),
  CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_complaint_citizen ON complaint(citizen_id);
CREATE INDEX idx_complaint_officer ON complaint(assigned_officer_id);
CREATE INDEX idx_complaint_category ON complaint(category_id);
CREATE INDEX idx_complaint_status ON complaint(status);
CREATE INDEX idx_complaint_priority ON complaint(priority);
CREATE INDEX idx_investigation_note_complaint ON investigation_note(complaint_id);
CREATE INDEX idx_evidence_complaint ON evidence(complaint_id);
CREATE INDEX idx_notification_complaint ON notification(complaint_id);
CREATE INDEX idx_notification_citizen ON notification(citizen_id);
CREATE INDEX idx_complaint_feedback_complaint ON complaint_feedback(complaint_id);
CREATE INDEX idx_complaint_feedback_officer ON complaint_feedback(officer_id);
