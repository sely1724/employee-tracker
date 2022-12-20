// requirements
const inquirer = require("inquirer");
const fs = require("fs");
const cTable = require("console.table");
const mysql = require("mysql2");

//connect to sql
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "wZ(k3TmrlOWEForpDiQ[",
  database: "employee_management_system",
});

//initialize project.  Asks user questions in the terminal
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((response) => {
      if (response.task === "view all departments") {
        viewDepartments();
      } else if (response.task === "view all roles") {
        viewRoles();
      } else if (response.task === "view all employees") {
        viewEmployees();
      } else if (response.task === "add a department") {
        addDepartment();
      } else if (response.task === "add a role") {
        addRole();
      } else if (response.task === "add an employee") {
        addEmployee();
      } else {
        updateEmployeeRole();
      }
    });
}

// shows user all of the organization's departments
function viewDepartments() {
  db.query(`select * from departments`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n");
  });
  next();
}
// shows user all of the roles at the organization (including which dept the role is in)
function viewRoles() {
  db.query(`select * from roles`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n");
  });
  next();
}

// shows user all the employee information (including the employee's role and who their manager is)
function viewEmployees() {
  db.query(`select * from employees`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n");
  });
  next();
}

// enables user to add a department to the organization
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please add the department's name",
        name: "addDepartmentName",
      },
    ])
    .then((response) => {
      let query = `INSERT INTO departments (department_name) VALUES (?);`;
      //https://www.geeksforgeeks.org/node-js-mysql-insert-into-table/
      db.query(query, response.addDepartmentName, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Ok");
        }
      });
      next();
    });
}

// enables user to add a role to the organization
async function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please add the title of the role",
        name: "addRoleTitle",
      },
      {
        type: "number",
        message: "Please add the role's salary",
        name: "addRoleSalary",
      },
      {
        type: "list",
        message: "To which Department does the role belong?",
        name: "addRoleForeignKey",
        // asynchronous function to grab list of organization's current departments
        choices: await getDepartmentList(),
      },
    ])
    .then(async (response) => {
      const deptChosen = response.addRoleForeignKey;
      // asynchronous function that uses selected department name to grab the dept's ID.
      const deptID = await getDepartmentID(deptChosen);
      let responseArray = [
        `${response.addRoleTitle}`,
        `${response.addRoleSalary}`,
        `${deptID}`,
      ];
      let query = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
      db.query(query, responseArray, function (err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log("Ok");
        }
      });
      next();
    });
}
// allows users to add an employee
async function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please add the employee's first name",
        name: "addFName",
      },
      {
        type: "input",
        message: "Please add the employee's last name",
        name: "addLName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "addEmpRole",
        // asynchronous function to grab list of current roles at the organization
        choices: await getEmpRoles(),
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "addManager",
        // asynchronous function to grab list of employees at the organizaion.  IF there are 0 employees entered, choices displays NULL
        choices: await getEmployeeList(),
      },
    ])
    .then(async (response) => {
      const empRoleChosen = response.addEmpRole;
      // asynchronouse function to grab the ID of the role chosen based on the name.
      const empRoleID = await getRoleID(empRoleChosen);
      let responseArray = [];
      const employeeManagerChosen = response.addManager;
      // if statement in case manager was set to NULL
      if (employeeManagerChosen == "NULL") {
        responseArray = [
          `${response.addFName}`,
          `${response.addLName}`,
          `${empRoleID}`,
          null,
        ];
        // continued if statement - if user assigned a current employee to be new employee's manager, asynchronous function is called to grab that employee's ID
      } else {
        const managerID = await getManagerID(employeeManagerChosen);
        responseArray = [
          `${response.addFName}`,
          `${response.addLName}`,
          `${empRoleID}`,
          `${managerID}`,
        ];
      }
      console.log(responseArray);
      let query = `INSERT INTO employees (f_name, l_name, role_id, manager_id) VALUES (?,?,?,?)`;
      db.query(query, responseArray, function (err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log("Ok");
        }
      });
      next();
    });
}
// allows user to update employee's current position
async function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "updateEmployeeChoice",
        type: "list",
        message: "Which employee would you like to update:",
        // grabs list of employee's
        choices: await getEmployeeList(),
      },
    ])
    .then(async (answers) => {
      let employeeToUpdate = answers.updateEmployeeChoice;
      // asynchronous function to grab employee you want to updates ID.  Need to rename function because it's not just used in the manager case anymore.
      let empToUpdateID = await getManagerID(employeeToUpdate);
      // function called to update Employee's role.  Their Employee ID is passed through.
      updateRole(empToUpdateID);
    });

  next();
}

function next() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "task",
        message: "What would you like to do next?",
        choices: ["start new task", "quit"],
      },
    ])
    .then((response) => {
      if (response.task === "start new task") {
        init();
      } else {
        // way to exit from inquirer
        process.exit();
      }
    });
}

async function getDepartmentList() {
  let deptRoles = [];
  return new Promise((resolve, reject) => {
    db.query(
      `select d.department_name from departments d`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        for (i = 0; i < results.length; i++) {
          deptRoles.push(results[i].department_name);
        }
        resolve(deptRoles);
      }
    );
  });
}

async function getDepartmentID(deptChosen) {
  return new Promise((resolve, reject) => {
    db.query(
      `select d.id from departments d where d.department_name = "${deptChosen}"`,
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          //console.log(results[0].id);
          resolve(results[0].id);
        }
      }
    );
  });
}

async function getEmpRoles() {
  let empRoles = [];
  return new Promise((resolve, reject) => {
    db.query(`select r.title from roles r`, function (err, results) {
      if (err) {
        reject(err);
      }
      for (i = 0; i < results.length; i++) {
        empRoles.push(results[i].title);
      }
      resolve(empRoles);
    });
  });
}

async function getRoleID(empRoleChosen) {
  return new Promise((resolve, reject) => {
    db.query(
      `select r.id from roles r where r.title = "${empRoleChosen}"`,
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          //console.log(results[0].id);
          resolve(results[0].id);
        }
      }
    );
  });
}

async function getEmployeeList() {
  let empList = [];
  return new Promise((resolve, reject) => {
    db.query(
      `select emp.f_name, emp.l_name from employees emp`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        for (i = 0; i < results.length; i++) {
          empList.push(results[i].l_name + ", " + results[i].f_name);
        }

        if (empList.length >= 1) {
          // CHECK FOR EMPTY MANAGER - https://stackoverflow.com/questions/24403732/how-to-check-if-array-is-empty-or-does-not-exist
          resolve(empList);
        } else {
          resolve("NULL");
        }
      }
    );
  });
}

async function getManagerID(managerChosen) {
  // splitting reference: https://www.freecodecamp.org/news/javascript-split-how-to-split-a-string-into-an-array-in-js/
  return new Promise((resolve, reject) => {
    let fullName = managerChosen;
    let splitArray = fullName.split(", ");
    console.log(splitArray);
    let fName = splitArray[1];
    let lName = splitArray[0];
    console.log(fName);
    console.log(lName);

    db.query(
      `select emp.id from employees emp where emp.f_name = "${fName}" and emp.l_name = "${lName}" `,
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].id);
        }
      }
    );
  });
}

async function updateRole(empToUpdateID) {
  inquirer
    .prompt([
      {
        name: "updateRoleChoice",
        type: "list",
        message: "What is the employee's new role?",
        choices: await getEmpRoles(),
      },
    ])
    .then(async (answers) => {
      let empNewRoleChoice = answers.updateRoleChoice;
      let newRoleID = await getRoleID(empNewRoleChoice);
      changeEmployeeRole(empToUpdateID, newRoleID);
    });

  next();
}

async function changeEmployeeRole(empToUpdateID, newRoleID) {
  db.query(
    "UPDATE employee SET role_id = ? WHERE id = ?",
    [newRoleID, empToUpdateID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Role updated");
        console.log(results);
      }
    }
  );
}

init();
