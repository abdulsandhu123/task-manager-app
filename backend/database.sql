-- Task Manager Database
-- Import this file in phpMyAdmin OR run: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_completed TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data (optional)
INSERT INTO tasks (title, description, is_completed) VALUES
('Learn JavaScript', 'Finish the fetch() and DOM sections', 1),
('Complete Internship', 'Submit the CRUD project on GitHub', 0);
