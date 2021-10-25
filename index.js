//Create links to npm packages, set port
const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')

//Create connection to databases
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db',
    },
    console.log(`Connected to the company_db database.`)
);

//Create arrays for roles and managers for later use 
const departmentArr = []
const rolesArr = []
const employeesArr = []
let getRoles = () => {
    rolesArr.length = 0
    db.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            rolesArr.push(res[i].title);
        }
    })
}
let getEmployees = () => {
    employeesArr.length = 0
    db.query('SELECT * FROM employees;', (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            employeesArr.push(res[i].first_name)
        }
    })
}
let getDepartments = () => {
    departmentArr.length = 0
    db.query("SELECT * FROM departments;", (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
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
                "Delete",
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
                case "Delete":
                    deletion();
                    break
                default:
                    console.log("Thank you for using Employee Tracker. Goodbye");
                    process.exit();
            }
        })
        .catch((err) => { console.error(err) });
};

//Next 3 are functions to view all employees, roles and departments. Wouldn't normally add the option, but example video shows departments sorted alphabetically so add that in as well as an inquirer choice, might add it to the other 2 for conformity
const viewAllEmployees = () => {
    // inquirer.prompt([{
    //     tpye: 'list',
    //     message: "How do you want to view all employees?",
    //     name: "viewHow",
    //     choices: ["Without filters", "View by manager", "View by department"]
    // }]).then(ans => {
    //     if (ans.viewHow === "Without filters"){
    db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees JOIN roles on roles.id = employees.roles_id JOIN departments on departments.id = roles.departments_id left join employees e on employees.manager_id = e.id;", (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
            main()
            //         }
            //     })
            // } else if (ans.viewHow === "View by manager") {
            //     inquirer.prompt({
            //         tpye: 'list',
            //         message: "Which manager would you like to filter by?",
            //         name:"filterManager",
            //         choices:
        }
    })

    // })


}

const viewAllRoles = () => {
    db.query('SELECT roles.id, roles.title, roles.salary FROM roles;', (err, data) => {
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
async function updateEmployeeRole() {
    inquirer.prompt([{
        type: 'list',
        message: "Which employee's role would you like to update?",
        name: 'updateName',
        choices: employeesArr
    }, {
        type: 'list',
        message: "Which role would you like to assign to selected employee?",
        name: "updateNewRole",
        choices: rolesArr
    },]).then(async (ans) => {
        console.log(ans.updateName)
        db.query("UPDATE employees SET ? WHERE ?", [
            {
                roles_id: await getRoleID('roles', ans.updateNewRole)
            },
            {
                first_name: `${ans.updateName}`
            }], (err, res) => {
                if (err) throw err
                console.log("Updated employee's role")
                main()
            })
    })
}

//Functions to get department and role ID's
const getDepartmentID = (table, data) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM ${table} WHERE name = '${data}';`, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results[0].id)
            }
        })
    })
}

const getRoleID = (table, data) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM ${table} WHERE title = '${data}';`, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results[0].id)
            }
        })
    })
}

//Function to get employee ID's
const getEmployeeID = (table, data) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM ${table} WHERE first_name = '${data}';`, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results[0].id)
            }
        })
    })
}

//Next 3 add employee, role and department functions
async function addEmployee() {
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
        choices: rolesArr
    }, {
        type: 'list',
        message: "Who is the employee's manager?",
        name: 'addEmployeeManager',
        choices: employeesArr
    },
    ]).then(async (ans) => {
        db.query(`INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?);`,
            [ans.addEmployeeFirst, ans.addEmployeeLast, await getRoleID("roles", ans.addEmployeeRole), await getEmployeeID("employees", ans.addEmployeeManager)], (err, res) => {
                if (err) throw err
                console.log(`Added ${ans.addEmployeeFirst} ${ans.addEmployeeLast} to the database`)
                main()
                getEmployees()
            })
    })
}

async function addRole() {
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
    },]).then(async (ans) => {
        db.query(`INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)`, [ans.addRoleName, ans.addRoleSalary, `${await getDepartmentID("departments", ans.addRoleDepartment)}`], (err, res) => {
            if (err) throw err
            console.log(`Added ${ans.addRoleName} to the database.`)
            main()
            getRoles()
        })
    })
}
const addDepartment = () => {
    inquirer.prompt({
        type: "input",
        message: "What is the name of the new department?",
        name: 'newDepartment'
    }).then(ans => {
        db.query(`INSERT INTO departments (name) VALUES (?);`, ans.newDepartment)
        console.log(`Added ${ans.newDepartment} to the database.`)
        main()
        getDepartments()
    })
}

const deletion = () => {
    inquirer.prompt({
        type: "list",
        message: "What would you like to delete?",
        name: "deleteWhat",
        choices: ["Department", "Role", "Employee"]
    }).then(ans => {
        if (ans.deleteWhat === 'Department') {
            inquirer.prompt({
                type: "list",
                message: "Which department would you like to delete?",
                name: "deleteDepartment",
                choices: departmentArr
            }).then(ans => {
                console.table(ans.deleteDepartment)
                db.query('DELETE FROM departments WHERE name=?;', `${ans.deleteDepartment}`, (err, res) => {
                    if (err) throw err
                    console.log(`Deleted ${ans.deleteDepartment} from the database.`)
                    main()
                    getDepartments()
                })
            })
        } else if (ans.deleteWhat === "Role") {
            inquirer.prompt({
                type: "list",
                message: "Which role would you like to delete?",
                name: "deleteRole",
                choices: rolesArr
            }).then(ans => {
                db.query('DELETE FROM roles WHERE title=?;', `${ans.deleteRole}`, (err, res) => {
                    if (err) throw err
                    console.log(`Deleted ${ans.deleteRole} from the database.`)
                    main()
                    getRoles()
                })
            })
        } else {
            inquirer.prompt({
                type: "list",
                message: "Which employee would you like to delete?",
                name: "deleteEmployee",
                choices: employeesArr
            }).then(ans => {
                db.query('DELETE FROM employees WHERE first_name=?;', `${ans.deleteEmployee}`, (err, res) => {
                    if (err) throw err
                    console.log(`Deleted ${ans.deleteEmployee} from the database.`)
                    main()
                    getEmployees()
                })
            })
        }
    })
}

getDepartments()
getRoles()
getEmployees()
main()


