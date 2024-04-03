const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Please replace this with your actual password if applicable
    database: 'tracker_db' // Use the correct database name
});

// Function to view all roles
function viewAllRoles() {
    connection.query('SELECT * FROM ROLES', (err, roles) => {
        if (err) {
            console.error('Error retrieving roles: ' + err.stack);
            return;
        }
        console.log('Roles:');
        console.table(roles);
        mainMenu();
    });
}

// Function to view all employees
function viewAllEmployees() {
    const query = `
    SELECT EMPLOYEE.ID, EMPLOYEE.FIRST_NAME, EMPLOYEE.LAST_NAME, ROLES.TITLE AS JOB_TITLE, DEPARTMENTS.NAME AS DEPARTMENT_NAME, ROLES.SALARY,
           CONCAT(MANAGERS.FIRST_NAME, ' ', MANAGERS.LAST_NAME) AS MANAGER
    FROM EMPLOYEE
    INNER JOIN ROLES ON EMPLOYEE.ROLE_ID = ROLES.ID
    INNER JOIN DEPARTMENTS ON ROLES.DEPARTMENT_ID = DEPARTMENTS.ID
    LEFT JOIN EMPLOYEE AS MANAGERS ON EMPLOYEE.MANAGER_ID = MANAGERS.ID   
  `;

    connection.query(query, (err, employees) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            return;
        }

        console.log('Employees:');
        console.table(employees);
        mainMenu();
    });
}

// Function to view all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM DEPARTMENTS', (err, departments) => {
        if (err) {
            console.error('Error retrieving departments: ' + err.stack);
            return;
        }
        console.log('Departments:');
        console.table(departments);
        mainMenu();
    });
}

// Function to add a department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'ID',
            message: 'Enter the ID of the department:'
        },
        {
            type: 'input',
            name: 'NAME',
            message: 'Enter the name of the department:'
        }
    ]).then((answer) => {
        connection.query('INSERT INTO DEPARTMENTS SET ?', answer, (err, res) => {
            if (err) {
                console.error('Error adding department: ' + err.stack);
                return;
            }
            console.log('Department added successfully');
            mainMenu();
        });
    });
}

// Function to add a role
function addRole() {
    connection.query('SELECT * FROM DEPARTMENTS', (err, departments) => {
        if (err) {
            console.error('Error retrieving departments: ' + err.stack);
            return;
        }
        inquirer.prompt([
            {
                type: 'input',
                name: 'ID',
                message: 'Enter the ID of the role:'
            },
            {
                type: 'input',
                name: 'SALARY',
                message: 'Enter the salary for the role:'
            },
            {
                type: 'input',
                name: 'TITLE',
                message: 'Enter the title of the role:'
            },
            {
                type: 'list',
                name: 'DEPARTMENT_ID',
                message: 'Select the department for the role:',
                choices: departments.map(department => ({ name: department.NAME, value: department.ID }))
            }
        ]).then((answer) => {
            connection.query('INSERT INTO ROLES SET ?', answer, (err, res) => {
                if (err) {
                    console.error('Error adding role: ' + err.stack);
                    return;
                }
                console.log('Role added successfully');
                mainMenu();
            });
        });
    });
}

// Function to add an employee
function addEmployee() {
    connection.query('SELECT * FROM ROLES', (err, roles) => {
        if (err) {
            console.error('Error retrieving roles: ' + err.stack);
            return;
        }
        connection.query('SELECT * FROM EMPLOYEE', (err, employees) => {
            if (err) {
                console.error('Error retrieving employees: ' + err.stack);
                return;
            }
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'FIRST_NAME',
                    message: 'Enter the first name of the employee:'
                },
                {
                    type: 'input',
                    name: 'LAST_NAME',
                    message: 'Enter the last name of the employee:'
                },
                {
                    type: 'input',
                    name: 'ID',
                    message: 'Enter the ID of the employee:'
                },
                {
                    type: 'list',
                    name: 'ROLE_ID',
                    message: 'Select the role for the employee:',
                    choices: roles.map(role => ({ name: role.TITLE, value: role.ID }))
                },
                {
                    type: 'list',
                    name: 'MANAGER_ID',
                    message: 'Select the manager for the employee:',
                    choices: employees.map(employee => ({ name: `${employee.FIRST_NAME} ${employee.LAST_NAME}`, value: employee.ID }))
                }
            ]).then((answer) => {
                connection.query('INSERT INTO EMPLOYEE SET ?', {
                    FIRST_NAME: answer.FIRST_NAME,
                    LAST_NAME: answer.LAST_NAME,
                    ID: answer.ID,
                    ROLE_ID: answer.ROLE_ID,
                    MANAGER_ID: answer.MANAGER_ID

                }, (err, res) => {
                    if (err) {
                        console.error('Error adding employee: ' + err.stack);
                        return;
                    }
                    console.log('Employee added successfully');
                    mainMenu();
                });
            });
        });
    });
}


// Main menu function
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all roles',
                'View all employees',
                'View all departments',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Exit'
            ]
        }
    ]).then((answer) => {
        switch (answer.action) {
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Exit':
                connection.end();
                console.log('Goodbye!');
                break;
            default:
                console.log('Invalid option');
                mainMenu();
                break;
        }
    });
}

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
    // Call the main menu function after connecting to the database
    mainMenu();
});

