DROP DATABASE IF EXISTS
CREATE DATABASE

USE

CREATE TABLE departments
id: INT PRIMARY KEY
name: VARCHAR(30)

CREATE TABLE role
id: INT PRIMARY KEY
title: VARCHAR(30)
salary: DECIMAL
department_id: INT
FOREIGN KEY (department_id)
REFERENCES departments(id)

CREATE TABLE employee
id: INT PRIMARY KEY
first_name: VARCHAR(30)
last_name: VARCHAR(30)
role_id: INT to hold reference to employee role
manager_id: INT
FOREIGN KEY (role_id)
REFERENCES role(id)