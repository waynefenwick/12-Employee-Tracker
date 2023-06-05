const { prompt } = require('inquirer');
const db = require('./db/DB');

const init = () => {
  console.log('Employee Tracking');
  prompt([
    {
      type: 'list',
      name: 'task',
      message: 'What would you like to do?',
      choices: [
        'View all Departments',
        'View all Roles',
        'View all Employees',
        'Add a Department',
        'Remove a Department',
        'Add a Role',
        'Remove a Role',
        'Add an Employee',
        'Remove an Employee',
        'Update an Employee Role',
        'Update an Employee Manager',
        'View Employees by Manager',
        'View Employees by Department',
        'Combined Department Salaries',
        'Exit',
      ],
    },
  ]).then(({ task }) => {

    if (task === 'View all Departments') {
      db.viewAllDepts()
        .then((departments) => {
          console.log('View all Departments');
          console.table(departments);
          init();
        })
        .catch((error) => {
          console.error('Error retrieving departments:', error);
          init();
        });

    } else if (task === 'View all Roles') {
      db.viewAllRoles()
        .then((roles) => {
          console.log('View all Roles');
          console.table(roles);
          init();
        })
        .catch((error) => {
          console.error('Error retrieving roles:', error);
          init();
        });

    } else if (task === 'View all Employees') {
      db.viewAllEmployees()
        .then((employees) => {
        console.log('View all Employees');
          if (employees.length > 0) {
            const employeeData = employees.map((employee) => ({
              'ID': employee.id,
              'First Name': employee.first_name,
              'Last Name': employee.last_name,
              'Department': employee.department,
              'Role': employee.title,
              'Salary': employee.salary,
            }));
            console.table(employeeData);
          } else {
            console.log('No employees found.');
          }
          init();
        })
        .catch((error) => {
          console.error('Error retrieving employees:', error);
          init();
        });

    } else if (task === 'Add a Department') {
      prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'Enter name of the new department:',
        },
      ])
        .then(({ departmentName }) => {
          console.log('Add a department');
          db.addDepartment(departmentName)
            .then(() => {
              console.log('New department successfully added!');
              init();
            })
            .catch((error) => {
              console.error('Error adding department:', error);
              init();
            });
        });

    } else if (task === 'Remove a Department') {
      db.remDepartments()
        .then((departments) => {
          console.log('Remove a department');
          const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
          }));
          prompt([
            {
              type: 'list',
              name: 'departmentId',
              message: 'Select the department you want to remove:',
              choices: departmentChoices,
            },
          ])
            .then(({ departmentId }) => {
              db.delDepartment(departmentId)
                .then(() => {
                  console.log('Department successfully removed!');
                  init();
                })
                .catch((error) => {
                  console.error('Error removing department:', error);
                  init();
                });
            });
        })
        .catch((error) => {
          console.error('Error fetching departments:', error);
          init();
        });

    } else if (task === 'Add a Role') {
      db.getDepartments()
        .then((departments) => {
          console.log('Add a role');
          const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
          }));
          prompt([
            {
              type: 'input',
              name: 'title',
              message: 'What is the title of the role?:',
            },
            {
              type: 'list',
              name: 'departmentId',
              message: 'In which department is the role?:',
              choices: departmentChoices,
            },
            {
              type: 'input',
              name: 'salary',
              message: 'What is the salary of the role?:',
            },
          ])
            .then(({ title, departmentId, salary }) => {
              db.addRole(title, departmentId, salary)
                .then(() => {
                  console.log('Role successfully added!');
                  init();
                })
                .catch((error) => {
                  console.error('Error adding role:', error);
                  init();
                });
            });
        })
        .catch((error) => {
          console.error('Error fetching departments:', error);
          init();
        });

    } else if (task === 'Remove a Role') {
      db.getRoles()
        .then((roles) => {
          console.log('Remove a role');
          const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
          }));

          prompt([
            {
              type: 'list',
              name: 'roleId',
              message: 'Which role would you like to remove?',
              choices: roleChoices,
            },
          ])
            .then(({ roleId }) => {
              db.remRole(roleId)
                .then(() => {
                  console.log('Role successfully removed!');
                  init();
                })
                .catch((error) => {
                  console.error('Error removing role:', error);
                  init();
                });
            });
        })
        .catch((error) => {
          console.error('Error fetching role:', error);
          init();
        });

    } else if (task === 'Add an Employee') {
      db.getDepartments()
        .then((departments) => {
          console.log('Add an employee');
          const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
          }));
          db.getRoles()
            .then((roles) => {
              const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
              }));
              db.getEmployees()
                .then((employees) => {
                  const employeeChoices = employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                  }));
                  prompt([
                    {
                      type: 'input',
                      name: 'firstName',
                      message: 'First name:',
                    },
                    {
                      type: 'input',
                      name: 'lastName',
                      message: 'Last name:',
                    },
                    {
                      type: 'list',
                      name: 'roleId',
                      message: 'Role of the employee:',
                      choices: roleChoices,
                    },
                    {
                      type: 'list',
                      name: 'managerId',
                      message: 'Select the manager for the employee:',
                      choices: employeeChoices,
                    },
                  ])
                    .then(({ firstName, lastName, departmentsId, rolesId, managerId, salary }) => {
                      db.addEmployee(firstName, lastName, departmentsId, rolesId, managerId, salary)
                        .then(() => {
                          console.log('Employee successfully added!');
                          init();
                        })
                        .catch((error) => {
                          console.error('Error adding employee:', error);
                          init();
                        });
                    });
                })
                .catch((error) => {
                  console.error('Error fetching employees:', error);
                  init();
                });
            })
            .catch((error) => {
              console.error('Error fetching roles:', error);
              init();
            });
        })
        .catch((error) => {
          console.error('Error fetching departments:', error);
          init();
        });

    } else if (task === 'Remove an Employee') {
      db.getAllEmployees()
        .then((employees) => {
          const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }));
          prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Select the employee you want to remove:',
              choices: employeeChoices,
            },
          ])
            .then(({ employeeId }) => {
              db.remEmployee(employeeId)
                .then(() => {
                  console.log('Employee successfully removed!');
                  init();
                })
                .catch((error) => {
                  console.error('Error removing employee:', error);
                  init();
                });
            });
        })
        .catch((error) => {
          console.error('Error fetching employees:', error);
          init();
        });

    } else if (task === 'Update an Employee Role') {
      db.getAllEmployees()
        .then((employees) => {
          const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }));
          db.getAllRoles()
            .then((roles) => {
              const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
              }));
              prompt([
                {
                  type: 'list',
                  name: 'employeeId',
                  message: 'Select the employee you want to update:',
                  choices: employeeChoices,
                },
                {
                  type: 'list',
                  name: 'roleId',
                  message: 'Select the new role for the employee:',
                  choices: roleChoices,
                },
              ])
                .then(({ employeeId, roleId }) => {
                  db.updateEmployeeRole(employeeId, roleId)
                    .then(() => {
                      console.log('Employee role successfully updated!');
                      init();
                    })
                    .catch((error) => {
                      console.error('Error updating employee role:', error);
                      init();
                    });
                });
            })
            .catch((error) => {
              console.error('Error fetching roles:', error);
              init();
            });
        })
        .catch((error) => {
          console.error('Error fetching employees:', error);
          init();
        });

    } else if (task === 'Update an Employee Manager') {
      db.getAllEmployees()
        .then((employees) => {
          const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }));
          prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Select the employee you want to update:',
              choices: employeeChoices,
            },
          ])
            .then(({ employeeId }) => {
              db.getAllEmployees()
                .then((managers) => {
                  const managerChoices = managers.map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id,
                  }));
                  prompt([
                    {
                      type: 'list',
                      name: 'managerId',
                      message: 'Select the new manager for the employee:',
                      choices: managerChoices,
                    },
                  ])
                    .then(({ managerId }) => {
                      db.updateEmployeeManager(employeeId, managerId)
                        .then(() => {
                          console.log('Employee manager successfully updated!');
                          init();
                        })
                        .catch((error) => {
                          console.error('Error updating employee manager:', error);
                          init();
                        });
                    });
                })
                .catch((error) => {
                  console.error('Error fetching managers:', error);
                  init();
                });
            });
        })
        .catch((error) => {
          console.error('Error fetching employees:', error);
          init();
        });

    } else if (task === 'View Employees by Manager') {
      db.getEmployeesByManager()
        .then((employees) => {
          if (employees.length > 0) {
            console.log('Employees and their managers:');
            console.table(employees);
          } else {
            console.log('No employees found.');
          }
          init();
        })
        .catch((error) => {
          console.error('Error retrieving employees:', error);
          init();
        });

    } else if (task === 'View Employees by Department') {
      db.getEmployeesByDepartment()
        .then((employees) => {
          if (employees.length > 0) {
            console.log('Employees and their departments:');
            console.table(employees);
          } else {
            console.log('No employees found.');
          }
          init();
        })
        .catch((error) => {
          console.error('Error retrieving employees:', error);
          init();
        });

    } else if (task === 'Combined Department Salaries') {
      db.getCombinedDepartmentSalaries()
        .then((results) => {
          if (results.length > 0) {
            console.log('Combined department salaries:');
            console.table(results);
          } else {
            console.log('No departments found.');
          }
          init();
        })
        .catch((error) => {
          console.error('Error retrieving combined department salaries:', error);
          init();
        });

    } else {
      console.log('Goodbye!');
      process.exit();
    }
  });
};

init();
