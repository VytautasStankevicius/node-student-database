const http = require("http");
const url = require("url");
const fs = require("fs");
const data = fs.readFileSync(
  `${__dirname}/data/studentData.json`,
  "utf-8"
);
const students = JSON.parse(data);
const host = "localhost";
const port = "8888";
const replaceTemplate = require("./modules/replaceTemplate.js");
const sortClass = require("./modules/sortClass.js");
const sortAlphabetical = require("./modules/sortAlphabetical.js");
const main = fs.readFileSync(`${__dirname}/templates/main.html`, `utf-8`);
const studentItem = fs.readFileSync(`${__dirname}/templates/studentItem.html`, `utf-8`);
const studentPage = fs.readFileSync(`${__dirname}/templates/student.html`,`utf-8`);
const dropdownItem = fs.readFileSync(`${__dirname}/templates/dropdownItem.html`,`utf-8`);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  switch (pathname) {
    case "/":
      const itemRender = sortAlphabetical(students, "lastName").map((student) =>replaceTemplate(studentItem, student));
      const dropDownItemRender = sortClass(students).map((studentClass) => replaceTemplate(dropdownItem, studentClass));
      const output = main
        .replace(`{%STUDENT_CARDS%}`, itemRender.join(""))
        .replace(`{%CLASS%}`, dropDownItemRender.join(""));
      res.writeHead(200, {"Content-Type": "text/html",});
      res.end(output);
      break;

    case "/class":
      const itemRender2 = students
        .filter((student) => student.class.includes(query.class))
        .map((student) => replaceTemplate(studentItem, student));
      const dropDownItemRender2 = sortClass(students).map(
        (studentClass) => replaceTemplate(dropdownItem, studentClass)
      );
      let output2 = main.replace(`{%STUDENT_CARDS%}`, itemRender2.join(""));
      output2 = output2.replace(`{%CLASS%}`, dropDownItemRender2.join(""));
      res.writeHead(200, {"Content-Type": "text/html",});
      res.end(output2);
      break;
    // ---------------------Paieskos--------------------------------------------
    case "/searchName":
      const itemRenderFirstName = students.filter((student) => student.firstname.includes(query.firstName)).map((student) => replaceTemplate(studentItem, student));
      const dropDownItemRenderFirstName = sortClass(students).map((studentClass) => replaceTemplate(dropdownItem, studentClass));
      let outputFirsName = main.replace(`{%STUDENT_CARDS%}`,itemRenderFirstName.join(""));
      outputFirsName = outputFirsName.replace(`{%CLASS%}`,dropDownItemRenderFirstName.join(""));
      res.writeHead(200, {"Content-Type": "text/html",});
      res.end(outputFirsName);
      break;

    case "/searchSurname":
      const itemRenderLastName = students.filter((student) => student.lastName.includes(query.lastName)).map((student) => replaceTemplate(studentItem, student));
      const dropDownItemRenderLastName = sortClass(students).map((studentClass) => replaceTemplate(dropdownItem, studentClass));
      let outputLastName = main.replace(`{%STUDENT_CARDS%}`,itemRenderLastName.join(""));
      outputLastName = outputLastName.replace(`{%CLASS%}`,dropDownItemRenderLastName.join(""));
      res.writeHead(200, {"Content-Type": "text/html",});
      res.end(outputLastName);
      break;
    
    case "/searchClass":
      const outputClass = main.replace(`{%STUDENT_CARDS%}`, students.filter(student => student.class.includes(query.class)).map(student => replaceTemplate(studentItem, student)).join(''))
        .replace(`{%CLASS%}`, sortClass(students).map(studentClass => replaceTemplate(dropdownItem, studentClass)).join(''));
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(outputClass);
      break;
  //  --------------------------StudentoKortele--------------------------------------
   case "/student":
      res.writeHead(200, {"Content-Type": "text/html"});
      const studentHtml = replaceTemplate(studentPage, students[query.id]);
      res.end(studentHtml);
      break;

    default:
      res.writeHead(404, {"Content-Type": "text/html",});
      res.end("<h1>Page not found</h1>");
}
});

server.listen(port, host, () => {
  console.log(`Server listening on port ${port}`);
});


//----------------StudentoVidurkis-----------------------------
// const updatedStudents = students.map(student => {
//   const totalGrades = student.subjects_grades.math + student.subjects_grades.physics + student.subjects_grades.chemistry;
//   const average = (totalGrades /  3).toFixed(2);
//   return { ...student, average };
// });

// const json1 = JSON.stringify(updatedStudents);
// fs.writeFileSync(`${__dirname}/data/studentAverage.json`, json1, "utf-8");
// ---------------------------------------------------------------




