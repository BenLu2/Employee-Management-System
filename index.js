const { prompt} = require("inquirer");
const db = require("./db");
require('console.table');
const connection = require('./db/connection')
const mysql = require('mysql2')

const connection = mysql.createConnection(
  {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'CMS_db'
  }
)

console.table(
  "\n------------ Welcome to the Employee Management System (EMS ------------\n"
)

//Main Menu
function MainPrompts() {
  prompt([
    {
      type:"list",
      name:"choice",
      message:"What would you like to do?",
      choices: [
        {
          name: "View all Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "Add employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPlOYEE"
        },
        {
          name: "View all Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "View all Departments",
          value: "VIEW_DEPT"
  
        }, 
        {
          name: "Add Department",
          value: "ADD_DEPT"
        },
        {
          name: "Quit",
          value: "Quit"
        }
      ]
    }
  ]).then(res => {
    let choice = res.choice;
    switch (choice){
    case "VIEW_EMPLOYEES":
    viewEmployees();
    break;
    case "VIEW_ROLES":
    viewRoles();
    break;
    case "VIEW_DEPT":
    viewDepartments();
    break;
    case "ADD_EMPLOYEE":
    addEmployee();
    break;
    case "ADD_Role":
    addRole();
    break;
    case "ADD_DEPT":
    addDepartment();
    break;
    case "UPDATE_EMPlOYEE":
    updateEmployee();
    break;
    case "Quit":
    Quit();
    break;
    }
  })
}

//view all employees
const viewEmployees = () => {
  connection.promise().query(
      "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary as Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN employee manager on manager.id = employee.manager_id LEFT JOIN department ON role.department_id = department.id;"
  ).then(([response]) => {
      console.log("\n")
      console.table(response)
  }).then(() => MainPrompts()
  )
}

//add a new employee
const addEmployee = () => {
  connection.promise().query("SELECT role.title, role.id FROM role;")
      .then(([res]) => {
          inquirer.prompt([
              {
                  type: 'input',
                  name: 'first_name',
                  message: "What is the new employee's first name?"
              },
              {
                  type: 'input',
                  name: 'last_name',
                  message: "What is the new employee's last name?"
              },
              {
                  type: 'list',
                  name: 'role',
                  message: "What is the new employee's role?",
                  choices: res.map(({ title, id }) => ({ name: title, value: id }))
              }

          ]).then((res) => {
              let newFirstName = res.first_name
              let newLastName = res.last_name
              let newRole = res.role

              connection.promise().query("SELECT employee.first_name, employee.last_name, employee.id FROM employee WHERE manager_id IS NULL;")
                  .then(([res]) => {
                      inquirer.prompt([
                          {
                              type: 'list',
                              name: 'manager',
                              message: "Who is the new employee's manager?",
                              choices: res.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }))
                          }
                      ]).then((res) => {
                          let newManager = res.manager
                          const newEmployee = [`${newFirstName}`, `${newLastName}`, `${newRole}`, `${newManager}`]
                          connection.promise().query(
                              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)", newEmployee
                          ).then(console.log('\n', '\n', 'New Employee Added!', '\n', '\n')
                          ).then(() => MainPrompts())

                      })
                  })
          })
      })
}


// see all departments
const viewDepartments = () => {
  connection.promise().query(
      "SELECT * FROM department;"
  ).then(([response]) => {
      console.log("\n")
      console.table(response)
  }).then(() => MainPrompts()
  )
}

//add a department
const addDepartment = () => {
  inquirer.prompt([
      {
          type: 'input',
          name: 'name',
          message: 'What new department do you wish to add?'
      }
  ]).then((res) => {
      const newDepartment = res.name
      connection.promise().query(
          "INSERT INTO department (name) VALUES(?)", newDepartment
      ).then(() => {
          console.log('\n', '\n', `Your department update has been made!`, '\n', '\n')
      }).then(() => MainPrompts())
  })
}

//update an employee role
const updateEmployee = () => {
  connection.promise().query("SELECT * from employee")
      .then(([res]) => {
          inquirer.prompt([
              {
                  type: 'list',
                  name: 'employee',
                  message: `Which employee would you like to update?`,
                  choices: res.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}))
              }
          ]).then((res) => {
              const updatedEmployee = res.employee
              connection.promise().query("SELECT role.id, role.title FROM role")
              .then(([res]) => {
                  inquirer.prompt([
                      {
                          type: 'list',
                          name: 'viewRoles',
                          message: 'What would you like their new role to be?',
                          choices: res.map(({title, id}) => ({name: title, value: id}))
                      }
                  ]).then((res) => {
                      connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [res.viewRoles, updatedEmployee]
                      ).then(console.log('\n', '\n', 'Employee role updated!', '\n', '\n')
                      ).then(() => MainPrompts())
                  })
              })

          })
      })
}

//view all roles
const viewRoles = () => {
  connection.promise().query(
      "SELECT role.id, role.role_title, role.role_salary, department.name AS department FROM role JOIN department on role.department_id = department.id;"
  ).then(([response]) => {
      console.log("\n")
      console.table(response)
  }).then(() => MainPrompts()
  )
}

//add a role
const addRole = () => {
  connection.promise().query("SELECT department.name, department.id FROM department;"
  ).then(([res]) => {
      inquirer.prompt([
          {
              type: 'input',
              name: 'title',
              message: 'What is the title of the new role?'
          },
          {
              type: 'input',
              name: 'salary',
              message: 'What is the salary for the new role?'
          },
          {
              type: 'list',
              name: 'department',
              message: 'What department is the role assigned to?',
              choices: res.map(({ name, id }) => ({ name: name, value: id }))
          }
      ]).then((res) => {
          const newRole = [`${res.title}`, `${res.salary}`, `${res.department}`]
          connection.promise().query(
              "INSERT INTO role (role_title, role_salary, department_id) VALUES(?, ?, ?)", newRole
          ).then(() => {
              console.log('\n', '\n', `Your update has been made!`, '\n', '\n')
          }).then(() => MainPrompts())
      })
  })
}


function Quit() {
  process.exit()
}