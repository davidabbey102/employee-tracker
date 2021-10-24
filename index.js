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
        user: 'root',
        password: 'password',
        database: 'company_db',
    },
    console.log(`Connected to the registar_db database.`)
);

//Create arrays for roles and managers for later use 
const departmentArr = []
const roleArr = []
const epmloyeesArr = []
let getRoles = () => {
    db.query(`SELECT * FROM roles;`, (err, res) =>{
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
          roleArr.push(res[i].title);
        }})
}
let getEmployees = () =>{
    db.query('SELECT CONCAT (employees.first_name," ",employees.last_name) AS full_name;', (err,res)=>{
        if (err) throw err
        for (let i = 0; i < res.length; i++){
            managerArr.push(res[i].full_name)
        }
    })
}
let getDepartments = ()=>{
    db.query("SELECT * FROM departments;", (err,res)=>{
        if(err) throw err
        for (let i = 0; i < res.length; i++){
            departmentArr.push(res[i].name)
        }
    })
}

//Main menu which will direct user to all functions to view what they desire to see and eventually loop back to this until they quit
const main = () => {
    inquirer
        .prompt([{
            type: "list",
            message: "What would you like to do?",
            name: "mainQuestion",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit",
            ],
        },
        ])
        .then((ans) => {
            switch (ans.mainQuestion) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                default:
                    console.log("Thank you for using Employee Tracker. Goodbye");
                    process.exit();
            }
        })
        .catch((err) => { console.error(err) });
};

//Next 3 are functions to view all employees, roles and departments. Wouldn't normally add the option, but example video shows departments sorted alphabetically so add that in as well as an inquirer choice, might add it to the other 2 for conformity
const viewAllEmployees = () => {
    db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees JOIN roles on roles.id = employees.roles_id JOIN departments on departments.id = roles.departments_id left join employees e on employees.manager_id = e.id;", (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
            main()
        }
    });
}

const viewAllRoles = () => {
    db.query('SELECT * FROM roles;', (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
            main()
        }
    });
}

const viewAllDepartments = () => {
    inquirer.prompt([{
        type: "list",
        message: "How would you like to view the departments?",
        name: "view",
        choices: [
            "Numerically by Department ID",
            "Alphabetically by Department Name",
        ]
    }])
        .then(ans => {
            if (ans.view === "Numerically by Department ID") {
                db.query('SELECT * FROM departments;', (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        console.table(data);
                        main()
                    }
                })
            } else {
                db.query('SELECT * FROM departments ORDER BY name;', (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        console.table(data);
                        main()
                    }
                })
            }
        });
}

//Updating employee role
const updateEmployeeRole = () => {
inquirer.prompt([{
    type: 'list',
    message: "Which employee's role would you like to update?",
    name: 'updateName',
    choices: managerArr
},{
    type: 'list',
    message: "Which role would you like to assign to selected employee?",
    name: "updateNewRole",
    choices: roleArr
}]).then(ans =>{
    let roleID = 
db.query(`UPDATE employees SET employees.roles_id=(SELECT  `)
    console.log("Updated employee's role")
    main()
})
}

//Next 3 add employee, role and department functions
const addEmployee = () => {

    inquirer.prompt([{
        type: 'input',
        message: "What is the employee's first name?",
        name: 'addEmployeeFirst'
    }, {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'addEmployeeLast'
    }, {
        type: 'list',
        message: "What is the employee's role?",
        name: 'addEmployeeRole',
        choices: roleArr
    }, {
        input: 'list',
        message: "Who is employee's manager?",
        name: 'addEmployeeManager',
        choices: managerArr
    }]).then(ans => {
        db.query(`INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?) [${ans.addEmployeeFirst}, ${ans.addEmployeeLast}, (SELECT roles_id from roles WHERE roles.title=${ans.addEmployeeRole}), (SELECT employees.id FROM employees WHERE (employees.first_name, employees.last_name)=${ans.addEmployeeManager});`)
        console.log(`Added ${ans.addEmployeeFirst} ${addEmployeeLast} to the database`)
        main()
        getEmployees()
    })
}

const addRole = () => {
    inquirer.prompt([{
        tpye: 'input',
        message: 'What is the name of the role?',
        name: 'addRoleName'
    }, {
        tpye: 'number',
        message: 'What is the salary of the role?',
        name: 'addRoleSalary'
    }, {
        type: 'list',
        message: 'To which department does the role belong?',
        name: 'addRoleDepartment',
        choices: departmentArr
    }]).then(ans => {
        db.query(`INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?) [${ans.addRoleName}, ${ans.addRoleSalary}, SELECT department.id FROM departments WHERE name=${ans.addRoleDepartment}];`)
        console.log(`Added ${ans.addRoleName} to the database.`)
        main()
        getRoles()
    })
}

const addDepartment = () => {
    inquirer.prompt({
        type: "input",
        message: "What is the name of the new department?",
        name: 'newDepartment'
    }).then(ans => {
        db.query(`INSERT INTO departments (name) VALUES (?) [${ans.newDepartment}]`)
        console.log(`Added ${ans.newDepartment} to the database.`)
        main()
        getDepartments()
    })
}

getDepartments()
getRoles()
getEmployees()
main()

