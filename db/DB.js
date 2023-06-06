const { log } = require('util');
const db = require('./connection');
const consoleTable = require('console.table');

class DB {
     constructor(db) {
          this.db = db;
     }

     viewAllDepts = () =>
          this.db.promise()
               .query(`
               SELECT * FROM departments`,
               )
               .then(([data]) =>
               console.table(data));

     viewAllRoles() {
          return this.db.promise()
               .query(`
               SELECT roles.id, roles.title, departments.name
               AS department, roles.salary FROM roles
               JOIN departments ON roles.departments_id = departments.id;
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     viewAllEmployees() {
          return this.db.promise()
               .query(`
               SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary
               FROM employees
               JOIN roles ON employees.roles_id = roles.id
               JOIN departments ON roles.departments_id = departments.id;
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     addDepartment(departmentName) {
          return this.db.promise()
               .query(`
               INSERT INTO departments (name)
               VALUES (?)`,
               [departmentName])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     remDepartments() {
          return this.db.promise()
               .query(`
               SELECT * FROM departments
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     delDepartment(departmentId) {
          return this.db.promise()
               .query(`
               DELETE FROM departments WHERE id = ?`,
               [departmentId])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     addRole(title, departmentId, salary) {
          return this.getDepartments()
               .then((departments) => {
                    const department = departments.find((department) =>
                    department.id === departmentId);
                    if (department) {
                         return this.db
                              .promise()
                              .query(`
                              INSERT INTO roles
                              (title, departments_id, salary)
                              VALUES (?, ?, ?)`,
                              [title, departmentId, salary]
                              )
                              .then(([result]) => {
                                   return result.insertId;
                              });
                    } else {
                         throw new Error(`Department with ID ${departmentId} does not exist.`);
                    }
               })
               .catch((error) => {
                    throw error;
               });
     }

     remRole(roleId) {
          return this.db.promise()
               .query(`
               DELETE FROM roles
               WHERE id = ?`,
               [roleId])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     addEmployee(firstName, lastName, roleId, managerId) {
          return this.db.promise()
               .query(`
               INSERT INTO employees
               (first_name, last_name, roles_id, manager_id)
               VALUES (?, ?, ?, ?)`,
               [firstName, lastName, roleId, managerId])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     getDepartments() {
          return this.db.promise()
               .query(`
               SELECT * FROM departments
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     getRoles() {
          return this.db.promise()
               .query(`
               SELECT * FROM roles
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }


     getEmployees() {
          return this.db.promise()
               .query(`
               SELECT e.first_name, e.last_name, e.departments_id, e.roles_id, e.manager_id, e.salary,
                    d.name AS department_name, r.title AS role_title,
               CONCAT(m.first_name, ' ', m.last_name) AS manager_name
               FROM employees AS e
               LEFT JOIN departments AS d ON e.departments_id = d.id
               LEFT JOIN roles AS r ON e.roles_id = r.id
               LEFT JOIN employees AS m ON e.manager_id = m.id
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }


     getAllEmployees() {
          return this.db.promise()
               .query(`
               SELECT * FROM employees
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     remEmployee(employeeId) {
          return this.db.promise()
               .query(`
               DELETE FROM employees
               WHERE id = ?`,
               [employeeId])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     updateEmployeeRole(employeeId, roleId) {
          return this.db.promise()
               .query(`
               UPDATE employees
               SET roles_id = ?
               WHERE id = ?`,
               [roleId, employeeId])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     getAllRoles() {
          return this.db.promise()
               .query(`
               SELECT * FROM roles
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     updateEmployeeManager(employeeId, managerId) {
          return this.db.promise()
               .query(`
               UPDATE employees
               SET manager_id = ?
               WHERE id = ?`,
               [managerId, employeeId])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     getEmployeesByDepartment(departmentId) {
          return this.db.promise()
               .query(`
               SELECT e.first_name, e.last_name, d.name
               AS department FROM employees
               AS e JOIN departments
               AS d ON e.departments_id = d.id
               WHERE d.id = ?`,
               [departmentId])
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     getManagers() {
          return this.db.promise()
               .query(`
               SELECT DISTINCT id, first_name, last_name FROM employees
               WHERE manager_id IS NULL;
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     getEmployeesByManager() {
          return this.db.promise()
               .query(`
               SELECT e.first_name, e.last_name, m.first_name
               AS manager_first_name, m.last_name
               AS manager_last_name FROM employees
               AS e LEFT JOIN employees
               AS m ON e.manager_id = m.id
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

// Employees and departments in which they work
     getEmployeesByDepartment() {
          return this.db.promise()
               .query(`
               SELECT e.first_name, e.last_name, d.name
               AS department_name FROM employees
               AS e INNER JOIN departments
               AS d ON e.departments_id = d.id
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

// Combined department salaries
     getCombinedDepartmentSalaries() {
          return this.db.promise()
               .query(`
               SELECT d.name AS department, SUM(r.salary)
               AS total_salary FROM departments
               AS d JOIN roles
               AS r ON d.id = r.departments_id
               JOIN employees
               AS e ON r.id = e.roles_id
               GROUP BY d.id
               `)
               .then(([rows]) => {
                    return rows;
               })
               .catch((error) => {
                    throw error;
               });
     }

     // Combined company salaries
     getCombinedCompanySalaries() {
          return this.db.promise()
               .query(`
               SELECT SUM(salary)
               AS combined salary expenditure
               FROM roles
               `)
               .then(([rows]) => {
               return rows;
               })
          .catch((error) => {
               throw error;
          });
     }
}

module.exports = new DB(db);
