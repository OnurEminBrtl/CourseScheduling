# 📚 Course Scheduling Web Application

This project is a simple web-based application that generates a weekly schedule by assigning university courses to available classrooms based on constraints like instructor availability, classroom capacity, and departmental requirements.

## ✅ Features

- Upload and parse CSV files for:
  - `courses.csv`: Detailed course information
  - `service.csv`: Fixed-time service courses
  - `classroom.csv`: Classrooms and capacities
  - `busy.csv`: Instructors' unavailable times
- Automatically assign courses to available time slots and classrooms
- Resolve scheduling conflicts using rules:
  - Avoid instructor busy slots
  - Prevent overlapping classes for same year or same instructor
  - Ensure classroom capacity is sufficient
- View timetable in a grid format (Days × Morning/Afternoon)
- Modal popup for course details

## 🗂 CSV File Formats

- **courses.csv**
  ```
  courseCode;courseName;year;credit;compulsaryOrElective;departmentOrService;studentsNumber;instructorName
  ```

- **service.csv**
  ```
  courseCode;day;dayTime
  ```

- **classroom.csv**
  ```
  classId;capacity
  ```

- **busy.csv**
  ```
  instructorName;day;dayTime
  ```

## 🛠 How It Works

1. User uploads all 4 CSV files.
2. Files are parsed using `Papa.parse` and stored in `localStorage`.
3. If all files are successfully loaded, user is redirected to `courses.html`.
4. Service courses are assigned first (fixed slots).
5. Remaining courses are assigned using conflict checks:
   - `checkInstructor`: avoids instructor busy times
   - `checkDay`: avoids overlapping courses for same instructor or year
   - `selectClassroom`: chooses an empty classroom with enough capacity

## 📦 Files

- `index.js`: Handles file input, parsing, and redirection
- `logic.js`: Main logic to assign courses, check constraints, and generate the visual schedule
- `logic.dev.js`: Minified/compiled version of `logic.js`

## 🚫 Limitations

- Fails if service courses conflict with instructor busy times or lack of classrooms
- No drag-drop or manual schedule adjustment

## 📍 Technologies Used

- HTML/CSS/JS
- Vanilla JavaScript (`localStorage`, DOM manipulation)
- `PapaParse` for CSV reading
