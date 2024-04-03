const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tracker_db'
});

// Sample data for departments, roles, and employees
const departmentsData = [
    { ID: 1, NAME: 'Engineering' },
    { ID: 2, NAME: 'Marketing' },
    { ID: 3, NAME: 'Finance' }
];

const rolesData = [
    { ID: 1, TITLE: 'Software Engineer', SALARY: 70000.00, DEPARTMENT_ID: 1 },
    { ID: 2, TITLE: 'Marketing Manager', SALARY: 80000.00, DEPARTMENT_ID: 2 },
    { ID: 3, TITLE: 'Financial Analyst', SALARY: 65000.00, DEPARTMENT_ID: 3 }
];

const employeesData = [
    { ID: 1, FIRST_NAME: 'John', LAST_NAME: 'Doe', ROLE_ID: 1, MANAGER_ID: null },
    { ID: 2, FIRST_NAME: 'Jane', LAST_NAME: 'Smith', ROLE_ID: 2, MANAGER_ID: 1 },
    { ID: 3, FIRST_NAME: 'Michael', LAST_NAME: 'Johnson', ROLE_ID: 3, MANAGER_ID: 1 },
    { ID: 4, FIRST_NAME: 'Emily', LAST_NAME: 'Williams', ROLE_ID: 1, MANAGER_ID: 2 },
    { ID: 5, FIRST_NAME: 'David', LAST_NAME: 'Brown', ROLE_ID: 2, MANAGER_ID: 2 },
    { ID: 6, FIRST_NAME: 'Jessica', LAST_NAME: 'Miller', ROLE_ID: 3, MANAGER_ID: 2 }
];

// Function to seed the database with sample data
function seedDatabase() {
    // Insert departments
    connection.query('INSERT IGNORE INTO DEPARTMENTS (ID, NAME) VALUES ?', [departmentsData.map(department => [department.ID, department.NAME])], (err, result) => {
        if (err) throw err;
        console.log('Departments inserted:', result.affectedRows);
    });

    // Insert roles
    connection.query('INSERT IGNORE INTO ROLES (ID, TITLE, SALARY, DEPARTMENT_ID) VALUES ?', [rolesData.map(role => [role.ID, role.TITLE, role.SALARY, role.DEPARTMENT_ID])], (err, result) => {
        if (err) throw err;
        console.log('Roles inserted:', result.affectedRows);
    });

    // Insert employees
    connection.query('INSERT IGNORE INTO EMPLOYEE (ID, FIRST_NAME, LAST_NAME, ROLE_ID, MANAGER_ID) VALUES ?', [employeesData.map(employee => [employee.ID, employee.FIRST_NAME, employee.LAST_NAME, employee.ROLE_ID, employee.MANAGER_ID])], (err, result) => {
        if (err) throw err;
        console.log('Employees inserted:', result.affectedRows);
        // Close the connection after seeding
        connection.end();
    });
}

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database as id', connection.threadId);
    // Seed the database with sample data
    seedDatabase();
});
