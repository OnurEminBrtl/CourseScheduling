"use strict";

var courses = getCourses();
var services = getServices();
var busyDays = getBusyDays();
var classrooms = getClassrooms();
var daysArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var dayTimeArr = ["Morning", "Afternoon"];
var ALL_DAYS = {
  Monday: {
    Morning: {},
    Afternoon: {}
  },
  Tuesday: {
    Morning: {},
    Afternoon: {}
  },
  Wednesday: {
    Morning: {},
    Afternoon: {}
  },
  Thursday: {
    Morning: {},
    Afternoon: {}
  },
  Friday: {
    Morning: {},
    Afternoon: {}
  }
};

var setServiceLessons = function setServiceLessons() {
  services.filter(function (service) {
    var serviceCourse = courses.find(function (course) {
      return course.courseCode === service.courseCode;
    });
    serviceCourse.day = service.day;
    serviceCourse.dayTime = service.dayTime;
    var selectedClass = selectClassroom(serviceCourse, serviceCourse.day, serviceCourse.dayTime);

    if (!selectedClass || checkInstructor(serviceCourse, serviceCourse.day, serviceCourse.dayTime)) {
      dropLoadedFiles();
      alert("There is no way to make a schedule for the department. We are dropping your loaded files, so you can upload with more classes or more capacity. \n This issue is comes out of this course: ".concat(serviceCourse.courseCode, ", \n Reason is: ").concat(!selectedClass ? "There is no class for this course." : "", " ").concat(checkInstructor(serviceCourse, serviceCourse.day, serviceCourse.dayTime) ? "Teacher's busy day." : "", " "));
      throw new Error("There is no way to make a schedule for the department.");
    }

    serviceCourse["class"] = selectedClass.classId;
    ALL_DAYS[serviceCourse.day][serviceCourse.dayTime][selectedClass.classId] = serviceCourse;
  });
};

var setCourses = function setCourses(course) {
  if (!course.day) {
    for (var i = 0; i < daysArr.length; i++) {
      for (var j = 0; j < dayTimeArr.length; j++) {
        var _checkInstructor = checkInstructor(course, daysArr[i], dayTimeArr[j]);

        var _checkDay = checkDay(course, daysArr[i], dayTimeArr[j]);

        if (course.day || _checkInstructor || _checkDay) continue;
        selectedClass = selectClassroom(course, daysArr[i], dayTimeArr[j]);

        if (selectedClass) {
          course.day = daysArr[i];
          course.dayTime = dayTimeArr[j];
          course["class"] = selectedClass.classId;
          ALL_DAYS[daysArr[i]][dayTimeArr[j]][selectedClass.classId] = course;
        }
      }
    }
  }

  if (!course.day) {
    dropLoadedFiles();
    alert("There is no way to make a schedule for the department. We are dropping your loaded files, so you can upload with more classes or more capacity. \n This issue is comes out of this course: ".concat(course.courseCode, ", \n Reason is: \"There is no class for this course.\"} "));
  }
};

var selectClassroom = function selectClassroom(course, day, dayTime) {
  var selectedClass = null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = classrooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _class = _step.value;

      if (!ALL_DAYS[day][dayTime][_class.classId] && course.studentsNumber <= _class.capacity) {
        if (!selectedClass) {
          selectedClass = _class;
        } else if (selectedClass.capacity > _class.capacity) {
          selectedClass = _class;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return selectedClass;
};

var checkDay = function checkDay(course, day, dayTime) {
  var isSameDayTime = false;
  var sameDayCourses = Object.values(ALL_DAYS[day][dayTime]);
  sameDayCourses.forEach(function (_anotherSameDayCourse) {
    if (course.year === _anotherSameDayCourse.year || course.instructorName === _anotherSameDayCourse.instructorName) {
      isSameDayTime = true;
    }
  });
  return isSameDayTime;
};

var checkInstructor = function checkInstructor(course, day, dayTime) {
  var isBusyDayTime = false;
  busyDays.forEach(function (busyDay) {
    if (course.instructorName === busyDay.instructorName && day === busyDay.day && dayTime === busyDay.dayTime) {
      isBusyDayTime = true;
    }
  });
  return isBusyDayTime;
}; // SHOW LESSONS


var timeSelector;

function getOrderedLessons() {
  var _loop = function _loop(i) {
    var _loop2 = function _loop2(j) {
      timeSelector = "".concat(daysArr[i].toLowerCase(), "-").concat(dayTimeArr[j].toLowerCase());
      classrooms.forEach(function (classroom) {
        var course = ALL_DAYS[daysArr[i]][dayTimeArr[j]][classroom.classId];
        var html = "";
        console.log(timeSelector);

        if (course) {
          html += "\n            <td>\n              <button class=\"non-bordered\" id=\"".concat(course.courseCode, "\">").concat(course.courseCode, "</button>\n            </td>\n          ");
        } else {
          html += "\n          <td></td>";
        }

        document.getElementById(timeSelector).innerHTML += html;
      });
    };

    for (var j = 0; j < dayTimeArr.length; j++) {
      _loop2(j);
    }
  };

  for (var i = 0; i < daysArr.length; i++) {
    _loop(i);
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
  return courses.find(function (_course) {
    return courseCode === _course.courseCode;
  });
}

window.addEventListener("click", function (event) {
  var course = getCourse(event.target.id);

  if (course) {
    var modal = document.getElementById("modal");
    modal.setAttribute("display", "fixed");
    modal.classList.remove("card-table-none");
    modal.classList.add("card-table");
    var table = document.getElementById("clicked-table");
    var html = "\n      <button id=\"close-button\" onclick=\"closeModal()\">X</button>\n      <tr>\n        <th>Classroom</th>\n        <td>".concat(course["class"], "</td>\n      </tr>\n      <tr>\n        <th>Course Code</th>\n        <td>").concat(course.courseCode, "</td>\n      </tr>\n      <tr>\n        <th>Course Name</th>\n        <td>").concat(course.courseName, "</td>\n      </tr>\n      <tr>\n        <th>Credit</th>\n        <td>").concat(course.credit, "</td>\n      </tr>\n      <tr>\n        <th>Day</th>\n        <td>").concat(course.day, "</td>\n      </tr>\n      <tr>\n        <th>Day Time</th>\n        <td>").concat(course.dayTime, "</td>\n      </tr>\n      <tr>\n        <th>Department Or Service</th>\n        <td>").concat(course.departmentOrService === "D" ? "Department" : "Service", "</td>\n      </tr>\n      <tr>\n        <th>Instructor Name</th>\n        <td>").concat(course.instructorName, "</td>\n      </tr>\n      <tr>\n        <th>Students Count</th>\n        <td>").concat(course.studentsNumber, "</td>\n      </tr>\n      <tr>\n        <th>Year</th>\n        <td>").concat(course.year, "</td>\n      </tr>\n    ");
    table.innerHTML = html;
  }
});

function closeModal() {
  var modal = document.getElementById("modal");
  modal.classList.add("card-table-none");
}

function getClasses() {
  dayTimeArr.forEach(function (dayTime) {
    var dayTimeSelector = "".concat(dayTime.toLowerCase(), "-tr");
    classrooms.forEach(function (_class) {
      var classes = document.getElementById(dayTimeSelector);
      var th = document.createElement("th");
      th.setAttribute("id", "th-1");
      th.textContent = _class.classId;
      classes.appendChild(th);
    });
  });
}