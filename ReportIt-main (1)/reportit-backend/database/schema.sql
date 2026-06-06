CREATE DATABASE IF NOT EXISTS reportit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reportit_db;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  CONSTRAINT pk_roles PRIMARY KEY (id),
  CONSTRAINT uq_roles_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(120) NOT NULL,
  description VARCHAR(255),
  CONSTRAINT pk_permissions PRIMARY KEY (id),
  CONSTRAINT uq_permissions_code UNIQUE (code)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  CONSTRAINT pk_role_permissions PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(40),
  role_id BIGINT NOT NULL,
  status VARCHAR(40) DEFAULT 'Active',
  joined_at DATE,
  created_at DATETIME,
  CONSTRAINT pk_users PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id BIGINT NOT NULL,
  avatar_url VARCHAR(500),
  address TEXT,
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  age VARCHAR(20),
  gender VARCHAR(40),
  city VARCHAR(120),
  state VARCHAR(120),
  pincode VARCHAR(40),
  map_query VARCHAR(255),
  department VARCHAR(120),
  display_id VARCHAR(80),
  CONSTRAINT pk_user_profiles PRIMARY KEY (user_id),
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS officers (
  user_id BIGINT NOT NULL,
  badge VARCHAR(80),
  position VARCHAR(120),
  zone VARCHAR(120),
  initials VARCHAR(10),
  active_cases VARCHAR(80),
  age VARCHAR(20),
  gender VARCHAR(40),
  station VARCHAR(120),
  department VARCHAR(120),
  experience VARCHAR(80),
  shift VARCHAR(80),
  address TEXT,
  map_query VARCHAR(255),
  emergency VARCHAR(80),
  joined_date VARCHAR(80),
  CONSTRAINT pk_officers PRIMARY KEY (user_id),
  CONSTRAINT fk_officers_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  CONSTRAINT pk_categories PRIMARY KEY (id),
  CONSTRAINT uq_categories_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS complaints (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_code VARCHAR(40) NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  location_text TEXT,
  category VARCHAR(120),
  priority VARCHAR(40) DEFAULT 'Pending',
  status VARCHAR(40) DEFAULT 'Pending',
  incident_date DATE,
  incident_time VARCHAR(40),
  citizen_id BIGINT NOT NULL,
  assigned_officer_id BIGINT,
  latitude DOUBLE,
  longitude DOUBLE,
  citizen_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  citizen_deleted_at DATETIME,
  created_at DATETIME,
  updated_at DATETIME,
  CONSTRAINT pk_complaints PRIMARY KEY (id),
  CONSTRAINT uq_complaints_code UNIQUE (complaint_code),
  CONSTRAINT fk_complaints_citizen FOREIGN KEY (citizen_id) REFERENCES users(id),
  CONSTRAINT fk_complaints_officer FOREIGN KEY (assigned_officer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS complaint_notes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT NOT NULL,
  officer_id BIGINT,
  note_text TEXT NOT NULL,
  created_at DATETIME,
  CONSTRAINT pk_complaint_notes PRIMARY KEY (id),
  CONSTRAINT fk_complaint_notes_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
  CONSTRAINT fk_complaint_notes_officer FOREIGN KEY (officer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS status_history (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT NOT NULL,
  changed_by BIGINT,
  old_status VARCHAR(40),
  new_status VARCHAR(40),
  remark TEXT,
  created_at DATETIME,
  CONSTRAINT pk_status_history PRIMARY KEY (id),
  CONSTRAINT fk_status_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
  CONSTRAINT fk_status_history_user FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS files (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT NOT NULL,
  uploaded_by BIGINT,
  file_name VARCHAR(255),
  file_path VARCHAR(600),
  content_type VARCHAR(120),
  size_bytes BIGINT,
  uploaded_at DATETIME,
  CONSTRAINT pk_files PRIMARY KEY (id),
  CONSTRAINT fk_files_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
  CONSTRAINT fk_files_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(180),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME,
  CONSTRAINT pk_notifications PRIMARY KEY (id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS otp_tokens (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL,
  otp_code VARCHAR(12) NOT NULL,
  purpose VARCHAR(80) NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME,
  CONSTRAINT pk_otp_tokens PRIMARY KEY (id)
);

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX idx_complaints_officer ON complaints(assigned_officer_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_files_complaint ON files(complaint_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_status_history_complaint ON status_history(complaint_id);
