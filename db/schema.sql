DROP DATABASE IF EXISTS CMS_db;
CREATE DATABASE CMS_db;

USE CMS_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE position (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  role_salary DECIMAL NOT NULL,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    manager_id INT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES position(id)
    ON DELETE SET NULL
);
