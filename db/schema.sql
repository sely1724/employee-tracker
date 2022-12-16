DROP DATABASE IF EXISTS employee_management_system;
CREATE DATABASE employee_management_system;

USE employee_management_system;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT -- fk reference departments
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  f_name VARCHAR(30) NOT NULL,
  l_name VARCHAR(30) NOT NULL,
  role_id INT, --fk reference employee role
  manager_id INT -- hold reference to other employee.  can be null.  
);


