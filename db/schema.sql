-- Example of schema --
DROP DATABASE IF EXISTS employee_info_db;
CREATE DATABASE employee_info_db;

USE employee_info_db;

CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30)
);

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    departments_id INT,
    salary DECIMAL (10, 2),
    FOREIGN KEY (departments_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    departments_id INT,
    roles_id INT,
    manager_id INT,
    salary INT,
    FOREIGN KEY (roles_id)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (departments_id)
    REFERENCES departments(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);
TRUNCATE TABLE employees; -- resets table
ALTER TABLE employees AUTO_INCREMENT = 1; -- fixes auto_increment
