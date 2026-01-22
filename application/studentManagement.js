const readline=require("readline");//node module

const rl=readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class studentManagement{
  constructor() {
    this.students=[];//empty array to store student objects
    this.subjects=[
      "Mathematics",
      "Physics",
      "Chemistry",
      "English",
      "Computer Science"
    ];
    this.nextId = 1;
  }

  pause(callback){
    rl.question("\nPress Enter to continue...", callback);
  }
//ADD Student
  addStudent(callback){
    console.log("\n  New Student details here  ");
    rl.question("Enter student name: ",(name) =>{ //name is stored after "enter"->callback
      if (!name || name.trim() === "") {
        console.log("Invalid name.");
        return this.pause(callback);
      }
      //student object 
      const student={
        id: this.nextId++,//incr id
        name:name.trim(),
        marks:{},
        totalMarks:0,
        avgMarks:0
      };
      let index=0; //current subject index
      const askMarks=()=>{ //one by one marks
        if(index === this.subjects.length){//when 5==5
          student.avgMarks = (student.totalMarks)/(this.subjects.length);//after getting all subject marks
          this.students.push(student);//strored to student array
          console.log("\nStudent added successfully.");
          return this.pause(callback);
        }

        //marks for each subject
        rl.question(
          `Enter marks for ${this.subjects[index]} (0-100): `,
          (input) => {
            const mark=Number(input);
            if (isNaN(mark)||mark<0||mark>100){
              console.log("Enter valid marks.");
              askMarks(); //again ask for the subject marks if invalid
            } 
            else{
              student.marks[this.subjects[index]]=mark;//points to mark and not subject names
              student.totalMarks+=mark;
              index++;
              askMarks();//ask for next subject marks
            }
          }
        );
      };
      askMarks();//next subject and add it to students 
  });
  }
  // Stdents list 
  listStudents(callback) {
    console.log("\n   List of the students    ");
    if (this.students.length === 0) {
      console.log("No students available.");
      return this.pause(callback);
    }
    this.students.forEach((student, index) => {
    console.log(`\nStudent ${index + 1}`);
    console.log(`ID   : ${student.id}`);
    console.log(`Name : ${student.name}`);

      //to print each subject with marks
      for(let subject in student.marks){
        console.log(`${subject}:${student.marks[subject]}`);
      }
    });
    this.pause(callback);
  }
//average
  getStudentAverage(callback) {
    console.log("\n  Average of a student  ");
    //user input
    rl.question("Enter student ID: ", (id) => {
    const student = this.students.find(s => s.id === Number(id));
    if(!student){
        console.log("Student not found.");
        return this.pause(callback);
      }
      console.log(`Name          : ${student.name}`);
      console.log(`Total Marks   : ${student.totalMarks}`);
      console.log(`Average Marks : ${student.avgMarks.toFixed(2)}`);
      this.pause(callback);
    });
  }
//highest score (subjectwise)
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

      let topStudent=this.students[0];//search for student
      for (let i = 1; i < this.students.length; i++) {
        if (this.students[i].marks[subject] > topStudent.marks[subject]) {
          topStudent = this.students[i];
        }
      }
      console.log(`Subject : ${subject}`);
      console.log(`Student : ${topStudent.name}`);
      console.log(`StudentID: ${topStudent.id}`);
      console.log(`Marks   : ${topStudent.marks[subject]}`);
      this.pause(callback);
    });
  }
//topper of the class
  overallTopper(callback) {
    if (this.students.length === 0) {
      console.log("\n No students available in the list.");
      return this.pause(callback);
    }

    let topper = this.students[0];//search
    for(let i = 1; i < this.students.length; i++){
      if (this.students[i].avgMarks > topper.avgMarks) {
        topper = this.students[i];
      }
    }
    console.log("\n  Topper student  ");
    console.log(`Name          : ${topper.name}`);
    console.log(`Student ID    : ${topper.id}`);
    console.log(`Average Marks : ${topper.avgMarks.toFixed(2)}`);
    console.log(`Total Marks   : ${topper.totalMarks}`);
    this.pause(callback);
  }
//class avg
  classAverage(callback) {
    if (this.students.length === 0) {
      console.log("\nNo students available.");
      return this.pause(callback);
    }
    let total=0;
    for(let i=0;i<this.students.length;i++){
        total+=this.students[i].avgMarks;
    }//avgmark from each student
    const avg=(total) / (this.students.length);//totol in class
    console.log("\n Average of the class  ");
    console.log(`Total Students : ${this.students.length}`);
    console.log(`Class Average  : ${avg.toFixed(2)}`);
    this.pause(callback);
  }
//options
  menu() {
    console.log("\n  Select the options  ");
    console.log("1. Add Student");
    console.log("2. List Students");
    console.log("3. Student Average");
    console.log("4. Highest Scorer (Subject)");
    console.log("5. Overall Topper");
    console.log("6. Class Average");
    console.log("7. Exit");
    console.log("\n");
    //user input
    rl.question("Enter choice (1-7): ", (choice) => {
      switch (Number(choice)) {//string input to number
        case 1: this.addStudent(() => this.menu());
            break;
        case 2: this.listStudents(() => this.menu()); 
            break;
        case 3: this.getStudentAverage(() => this.menu()); 
            break;
        case 4: this.highestScorerBySubject(() => this.menu()); 
            break;
        case 5: this.overallTopper(() => this.menu()); 
            break;
        case 6: this.classAverage(() => this.menu()); 
            break;

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
// Start the program
console.log("\n STUDENT MARK MANAGEMENT SYSTEM");
const system=new studentManagement();
system.menu();
