const { prompt} = require("inquirer");
const db = require("./db");
const cTable = require('console.table');
const connection = require('./db/connection')

function MainPrompts() {
  console.log(`Welcome to the Employee Management System (EMS)!`);
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
          name: "View all Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "View all Departments",
          value: "VIEW_DEPT"
  
        }, {
          name: "Add employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Update Employee",
          value: "UPDATE_EMPlOYEE"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Add Department",
          value: "ADD_DEPT"
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
    addEmployees();
    break;
    case "ADD_Role":
    addRole();
    break;
    case "ADD_Department":
    addDepartment();
    break;
    }
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
