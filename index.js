const inquirer = require("inquirer");
const fs = require("fs");
const cTable = require("console.table");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "wZ(k3TmrlOWEForpDiQ[",
    database: "employee_management_system",
  }
  //console.log(`Connected to the employee_management_system database.`)
);

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
        //done
        viewDepartments();
      } else if (response.task === "view all roles") {
        //done
        viewRoles();
      } else if (response.task === "view all employees") {
        //done
        viewEmployees();
      } else if (response.task === "add a department") {
        //done
        addDepartment();
      } else if (response.task === "add a role") {
        //done
        addRole();
      } else if (response.task === "add an employee") {
        addEmployee();
      } else {
        updateEmployeeRole();
      }
    });
}

function viewDepartments() {
  db.query(`select * from departments`, function (err, results) {
    console.log(results);
  });
  next();
}

function viewRoles() {
  db.query(`select * from roles`, function (err, results) {
    console.log(results);
  });
  next();
}

function viewEmployees() {
  db.query(`select * from employees`, function (err, results) {
    console.log(results);
  });
  next();
}

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
        choices: await getDepartmentList(),
      },
    ])
    .then(async (response) => {
      const deptChosen = response.addRoleForeignKey;
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
        choices: await getEmpRoles(),
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "addManager",
        choices: await getEmployeeList(),
      },
    ])
    .then(async (response) => {
      console.log("Fin");

      // NEXT STEP GET EMPLOYEE ROLE ID
      // NEXT STEP IF MANAGER != NULL THEN GET MANAGER ID
      // ELSE IF NULL USE THAT TO INSERT INTO SLOT
      // INSERT INFORMATION INTO TABLE
      //   const empRoleChosen = response.addEmpRole;
      //   const empRoleID = await getRoleID(empRoleChosen);
      //   let responseArray = [
      //     `${response.addFName}`,
      //     `${response.addLName}`,
      //     `${empRoleID}`,
      //   ];
      //   let query = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
      //   db.query(query, responseArray, function (err, results) {
      //     if (err) {
      //       console.log(err);
      //     } else {
      //       console.log("Ok");
      //     }
      //   });
      next();
    });
}

function updateEmployeeRole() {
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
        //end
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
  empList.push("NULL");
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
        // CHECK FOR EMPTY MANAGER - https://stackoverflow.com/questions/24403732/how-to-check-if-array-is-empty-or-does-not-exist
        resolve(empList);
      }
    );
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

init();
