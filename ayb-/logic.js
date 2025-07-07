const courses = getCourses();
const services = getServices();
const busyDays = getBusyDays();
const classrooms = getClassrooms();

const daysArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const dayTimeArr = ["Morning", "Afternoon"];

const ALL_DAYS = {
  Monday: { Morning: {}, Afternoon: {} },
  Tuesday: { Morning: {}, Afternoon: {} },
  Wednesday: { Morning: {}, Afternoon: {} },
  Thursday: { Morning: {}, Afternoon: {} },
  Friday: { Morning: {}, Afternoon: {} },
};

const setServiceLessons = () => {
  services.filter((service) => {
    const serviceCourse = courses.find((course) => course.courseCode === service.courseCode);
    serviceCourse.day = service.day;
    serviceCourse.dayTime = service.dayTime;
    const selectedClass = selectClassroom(serviceCourse, serviceCourse.day, serviceCourse.dayTime);
    if (!selectedClass || checkInstructor(serviceCourse, serviceCourse.day, serviceCourse.dayTime)) {
      dropLoadedFiles();
      alert(
        `There is no way to make a schedule for the department. We are dropping your loaded files, so you can upload with more classes or more capacity. \n This issue is comes out of this course: ${
          serviceCourse.courseCode
        }, \n Reason is: ${!selectedClass ? "There is no class for this course." : ""} ${
          checkInstructor(serviceCourse, serviceCourse.day, serviceCourse.dayTime) ? "Teacher's busy day." : ""
        } `
      );
      throw new Error("There is no way to make a schedule for the department.");
    }
    serviceCourse.class = selectedClass.classId;
    ALL_DAYS[serviceCourse.day][serviceCourse.dayTime][selectedClass.classId] = serviceCourse;
  });
};

const setCourses = (course) => {
  if (!course.day) {
    for (let i = 0; i < daysArr.length; i++) {
      for (let j = 0; j < dayTimeArr.length; j++) {
        const _checkInstructor = checkInstructor(course, daysArr[i], dayTimeArr[j]);
        const _checkDay = checkDay(course, daysArr[i], dayTimeArr[j]);
        if (course.day || _checkInstructor || _checkDay) continue;
        selectedClass = selectClassroom(course, daysArr[i], dayTimeArr[j]);
        if (selectedClass) {
          course.day = daysArr[i];
          course.dayTime = dayTimeArr[j];
          course.class = selectedClass.classId;
          ALL_DAYS[daysArr[i]][dayTimeArr[j]][selectedClass.classId] = course;
        }
      }
    }
  }
  if (!course.day) {
    dropLoadedFiles();
    alert(
      `There is no way to make a schedule for the department. We are dropping your loaded files, so you can upload with more classes or more capacity. \n This issue is comes out of this course: ${course.courseCode}, \n Reason is: "There is no class for this course."} `
    );
  }
};

const selectClassroom = (course, day, dayTime) => {
  let selectedClass = null;
  for (let _class of classrooms) {
    if (!ALL_DAYS[day][dayTime][_class.classId] && course.studentsNumber <= _class.capacity) {
      if (!selectedClass) {
        selectedClass = _class;
      } else if (selectedClass.capacity > _class.capacity) {
        selectedClass = _class;
      }
    }
  }
  return selectedClass;
};

const checkDay = (course, day, dayTime) => {
  let isSameDayTime = false;
  const sameDayCourses = Object.values(ALL_DAYS[day][dayTime]);
  sameDayCourses.forEach((_anotherSameDayCourse) => {
    if (course.year === _anotherSameDayCourse.year || course.instructorName === _anotherSameDayCourse.instructorName) {
      isSameDayTime = true;
    }
  });
  return isSameDayTime;
};

const checkInstructor = (course, day, dayTime) => {
  let isBusyDayTime = false;
  busyDays.forEach((busyDay) => {
    if (course.instructorName === busyDay.instructorName && day === busyDay.day && dayTime === busyDay.dayTime) {
      isBusyDayTime = true;
    }
  });
  return isBusyDayTime;
};

// SHOW LESSONS
let timeSelector;
function getOrderedLessons() {
  for (let i = 0; i < daysArr.length; i++) {
    for (let j = 0; j < dayTimeArr.length; j++) {
      timeSelector = `${daysArr[i].toLowerCase()}-${dayTimeArr[j].toLowerCase()}`;
      classrooms.forEach((classroom) => {
        const course = ALL_DAYS[daysArr[i]][dayTimeArr[j]][classroom.classId];
        let html = ``;
        console.log(timeSelector);
        if (course) {
          html += `
            <td>
              <button class="non-bordered" id="${course.courseCode}">${course.courseCode}</button>
            </td>
          `;
        } else {
          html += `
          <td></td>`;
        }
        document.getElementById(timeSelector).innerHTML += html;
      });
    }
  }
  getClasses();
}

function dropLoadedFiles() {
  localStorage.removeItem("classrooms");
  localStorage.removeItem("services");
  localStorage.removeItem("busyDays");
  localStorage.removeItem("courses");
  location.href = "/";
}

function getCourse(courseCode) {
  return courses.find((_course) => courseCode === _course.courseCode);
}

window.addEventListener("click", (event) => {
  const course = getCourse(event.target.id);
  if (course) {
    const modal = document.getElementById("modal");
    modal.setAttribute("display", "fixed");
    modal.classList.remove("card-table-none");
    modal.classList.add("card-table");
    const table = document.getElementById("clicked-table");
    const html = `
      <button id="close-button" onclick="closeModal()">X</button>
      <tr>
        <th>Classroom</th>
        <td>${course.class}</td>
      </tr>
      <tr>
        <th>Course Code</th>
        <td>${course.courseCode}</td>
      </tr>
      <tr>
        <th>Course Name</th>
        <td>${course.courseName}</td>
      </tr>
      <tr>
        <th>Credit</th>
        <td>${course.credit}</td>
      </tr>
      <tr>
        <th>Day</th>
        <td>${course.day}</td>
      </tr>
      <tr>
        <th>Day Time</th>
        <td>${course.dayTime}</td>
      </tr>
      <tr>
        <th>Department Or Service</th>
        <td>${course.departmentOrService === "D" ? "Department" : "Service"}</td>
      </tr>
      <tr>
        <th>Instructor Name</th>
        <td>${course.instructorName}</td>
      </tr>
      <tr>
        <th>Students Count</th>
        <td>${course.studentsNumber}</td>
      </tr>
      <tr>
        <th>Year</th>
        <td>${course.year}</td>
      </tr>
    `;
    table.innerHTML = html;
  }
});

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("card-table-none");
}

function getClasses() {
  dayTimeArr.forEach((dayTime) => {
    const dayTimeSelector = `${dayTime.toLowerCase()}-tr`;
    classrooms.forEach((_class) => {
      const classes = document.getElementById(dayTimeSelector);
      const th = document.createElement("th");
      th.setAttribute("id", "th-1");
      th.textContent = _class.classId;
      classes.appendChild(th);
    });
  });
}
