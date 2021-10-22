//Create links to npm packages, set port
const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require("express");
const cTable = require('console.table')
const app = express()
const PORT = process.env.PORT || 3000

//Create connection to databases
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'registrar_db',
    },
    console.log(`Connected to the registar_db database.`)
  );

const main = () => {
    inquirer
        .prompt([{
            input: "checkbox",
            message: "What would you like to do?",
            name: "firstQuestion",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "Add Role", "View All Departments", "Add Department", "Quit"],
        }])
        .then(ans => {
            if (ans.firstQuestion === "View All Employees") {
                viewAllEmployees()
            } else if (ans.firstQuestion === "Add Employee") {
                addEmployee()
            } else if (ans.firstQuestion === "Update Employee Role") {
                updateEmployeeRole()
            } else if (ans.firstQuestion === "Add Role") {
                addRole()
            } else if (ans.firstQuestion === "View All Departments") {
                viewAllDepartments()
            } else if (ans.firstQuestion === "Add Department") {
                addDepartment()
            } else {
                return
            }
        })
        .catch((err) => { console.error(err) })
}

const viewAllEmployees = () => {

    main()
}

const viewAllDepartments = () => {

    main()
}

const addEmployee = () => {

    main()
}

const updateEmployeeRole = () => {

    main()
}

const addRole = () => {

    main()
}


const addDepartment = () => {

    main()
}

main()