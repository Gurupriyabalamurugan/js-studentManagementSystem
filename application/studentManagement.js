const readline = require("readline");//node module
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
class Subject {
  constructor(name) {
    this.name = name;
  }
}
class Mark {
  constructor(subject, score) {
    this.subject=subject; 
    this.score=score; 
  }
}
class Student {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.marks = []; // array of Mark objects
  }
  addMark(mark) {
    this.marks.push(mark);
  }
  getTotalMarks() {
  let total = 0;
  for (let i = 0; i < this.marks.length; i++) {
    total = total + this.marks[i].score; // add each mark
  }
  return total;
}
// Get average marks
getAverageMarks() {
  if (this.marks.length === 0) {
    return 0;
  }
  let total = this.getTotalMarks(); 
  let average=(total) / (this.marks.length);
  return average;
}

// Get mark for each subject
getMarkForSubject(subjectName) {
  for (let i = 0; i < this.marks.length; i++) {
    if (this.marks[i].subject.name === subjectName) {
      return this.marks[i].score;
    }
  }
  return 0; // no subject
}
}
//main class
class StudentManagement{
  constructor() {
    this.students=[];//empty array for storing students
    this.subjects = [
      new Subject("Mathematics"),
      new Subject("Physics"),
      new Subject("Chemistry"),
      new Subject("English"),
      new Subject("Computer Science")
    ];
    this.nextId = 1;
  }
  pause(callback) {
    rl.question("\nPress Enter to continue...", callback);
  }
  // Add a new student
  addStudent(callback) {
    console.log("\n  New Student details here  ");
    rl.question("Enter student name: ", (name) => {
      if (!name || name.trim() === "") {
        console.log("Invalid name.");
        return this.pause(callback);
      }
      const student = new Student(this.nextId++, name.trim());
      let index=0;
      const askMarks = () => {
        if (index===this.subjects.length) {//until 5==5
          this.students.push(student);
          console.log("\nStudent added successfully.");
          return this.pause(callback);
        }

        rl.question(`Enter marks for ${this.subjects[index].name} (0-100): `, (input) => {
          const markValue = Number(input);
          if (isNaN(markValue) || markValue < 0 || markValue > 100) {
            console.log("Enter valid marks.");
            return askMarks();
          }
          student.addMark(new Mark(this.subjects[index], markValue));
          index++;
          askMarks();
        });
      };
      askMarks();//storing in the array
    });
  }
  // List all students
  listStudents(callback) {
    console.log("\n   List of the students    ");
    if (this.students.length === 0) {
      console.log("No students available.");
      return this.pause(callback);
    }

    this.students.forEach((student, idx) => {
      console.log(`\nStudent ${idx + 1}`);
      console.log(`ID   : ${student.id}`);
      console.log(`Name : ${student.name}`);
      student.marks.forEach(mark => {
        console.log(`${mark.subject.name}: ${mark.score}`);
      });
    });

    this.pause(callback);
  }

  // Student average
  getStudentAverage(callback) {
    rl.question("Enter student ID: ", (id) => {
      const student = this.students.find(s => s.id === Number(id));
      if (!student) {
        console.log("Student not found.");
        return this.pause(callback);
      }
      console.log(`\nName      : ${student.name}`);
      console.log(`Total Marks : ${student.getTotalMarks()}`);
      console.log(`Average Marks: ${student.getAverageMarks().toFixed(2)}`);
      this.pause(callback);
    });
  }
// Highest scorer (subjectwise)
highestScorerBySubject(callback) {
  if (this.students.length === 0) {
    console.log("\nNo students available.");
    return this.pause(callback);
  }
  console.log("\nAvailable subjects:");
  this.subjects.forEach((s, i) => console.log(`${i + 1}. ${s}`));
  rl.question("\nEnter subject name: ", (subject) => {
    if (!this.subjects.includes(subject)) {
      console.log("Invalid subject.");
      return this.pause(callback);
    }
    let topStudent = this.students[0]; // assume first student is top initially
    for (let i = 1; i < this.students.length; i++) {
      if (this.students[i].marks[subject] > topStudent.marks[subject]) {
        topStudent = this.students[i];
      }
    }

    console.log(`\nSubject: ${subject}`);
    console.log(`Student: ${topStudent.name}`);
    console.log(`StudentID: ${topStudent.id}`);
    console.log(`Marks  : ${topStudent.marks[subject]}`);

    this.pause(callback);
  });
}
  // Overall topper
  overallTopper(callback) {
    if (this.students.length === 0) {
      console.log("\nNo students available.");
      return this.pause(callback);
    }

    let topper = this.students[0];
    for (let i = 1; i < this.students.length; i++) {
      if (this.students[i].getAverageMarks() > topper.getAverageMarks()) {
        topper = this.students[i];
}
    }

    console.log("\n  Topper student  ");
    console.log(`Name    : ${topper.name}`);
    console.log(`Student ID : ${topper.id}`);
    console.log(`Average Marks: ${topper.getAverageMarks().toFixed(2)}`);
    console.log(`Total Marks  : ${topper.getTotalMarks()}`);
    this.pause(callback);
  }

  // Class average
classAverage(callback) {
  if (this.students.length === 0) {
    console.log("\nNo students available.");
    return this.pause(callback);
  }

  let totalAverage = 0; // avg of avg
  for (let i = 0;i < this.students.length;i++) {
    totalAverage += this.students[i].getAverageMarks();
  }

  let classAverage = 0;
  if (this.students.length > 0) {
    classAverage=(totalAverage) / (this.students.length); // divide by number of students
  }

  console.log("\n Average of the class  ");
  console.log("Total Students :", this.students.length);
  console.log("Class Average  :", classAverage.toFixed(2));
  this.pause(callback);
}
  // Menu
  menu() {
    console.log("\n  Select the options  ");
    console.log("1. Add Student");
    console.log("2. List Students");
    console.log("3. Student Average");
    console.log("4. Highest Scorer (Subject)");
    console.log("5. Overall Topper");
    console.log("6. Class Average");
    console.log("7. Exit");

    rl.question("Enter choice (1-7): ", (choice) => {
      switch (Number(choice)){//string input to number
        case 1: this.addStudent(() => this.menu()); break;
        case 2: this.listStudents(() => this.menu()); break;
        case 3: this.getStudentAverage(() => this.menu()); break;
        case 4: this.highestScorerBySubject(() => this.menu()); break;
        case 5: this.overallTopper(() => this.menu()); break;
        case 6: this.classAverage(() => this.menu()); break;
        case 7:
          console.log("\nProgram exited.");
          rl.close();
          break;
        default:
          console.log("Invalid choice.");
          this.menu();
      }
    });
  }
}
console.log("\n STUDENT MARK MANAGEMENT SYSTEM");
const system=new StudentManagement();
system.menu();
