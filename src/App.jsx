import { useEffect, useMemo, useRef, useState } from "react";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const academicYearStart = currentDate.getMonth() >= 6 ? currentYear : currentYear - 1;
const currentAcademicYear = `${academicYearStart}–${String(academicYearStart + 1).slice(-2)}`;
const currentDateLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(currentDate).toUpperCase();
const currentShortDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(currentDate);
const currentClassDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(currentDate);

const icons = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
  people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h7" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
};

function Icon({ name, size = 18, className = "" }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

const schedule = [
  { time: "09:00 AM", end: "10:00 AM", subject: "Data Structures", room: "Room 204", code: "CS 301", color: "purple" },
  { time: "10:15 AM", end: "11:15 AM", subject: "Database Systems", room: "Lab 03", code: "CS 305", color: "blue" },
  { time: "12:00 PM", end: "01:00 PM", subject: "Computer Networks", room: "Room 108", code: "CS 308", color: "peach" },
];

const studentCourses = [
  { code: "CS 301", name: "Data Structures", instructor: "Dr. Anita Sharma", credits: 4, schedule: "Mon, Wed · 09:00 AM", attendance: 92, classes: "46 / 50", nextClass: "Monday · 09:00 AM", description: "Learn how to organize, store, and process data efficiently using core data structures and algorithms.", topics: ["Arrays & linked lists", "Trees & graphs", "Sorting & searching"], color: "purple" },
  { code: "CS 305", name: "Database Systems", instructor: "Prof. Vikram Rao", credits: 4, schedule: "Mon, Wed · 10:15 AM", attendance: 88, classes: "44 / 50", nextClass: "Monday · 10:15 AM", description: "Explore relational database design, SQL, transactions, and reliable data management.", topics: ["Relational modeling", "SQL & queries", "Transactions"], color: "blue" },
  { code: "CS 308", name: "Computer Networks", instructor: "Dr. Meera Nair", credits: 3, schedule: "Mon, Thu · 12:00 PM", attendance: 84, classes: "42 / 50", nextClass: "Monday · 12:00 PM", description: "Understand how computer systems communicate, from network protocols to modern applications.", topics: ["Network layers", "Routing & switching", "Network security"], color: "peach" },
  { code: "CS 312", name: "Operating Systems", instructor: "Prof. Rahul Menon", credits: 4, schedule: "Tue, Thu · 11:00 AM", attendance: 90, classes: "45 / 50", nextClass: "Tuesday · 11:00 AM", description: "Study the systems that manage computer hardware, processes, memory, and files.", topics: ["Processes & threads", "Memory management", "File systems"], color: "green" },
  { code: "CS 320", name: "Software Engineering", instructor: "Dr. Kavita Das", credits: 3, schedule: "Tue, Fri · 02:00 PM", attendance: 86, classes: "43 / 50", nextClass: "Tuesday · 02:00 PM", description: "Practice the methods and tools used to plan, build, test, and maintain software projects.", topics: ["Requirements & design", "Testing & quality", "Agile development"], color: "lavender" },
];

const departments = [
  "Computer Science Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Arts & Science",
];
const academicYears = ["1st year", "2nd year", "3rd year", "4th year"];

const departmentReports = {
  "Computer Science Engineering": { attendance: 91 },
  "Information Technology": { attendance: 88 },
  "Electronics & Communication": { attendance: 84 },
  "Electrical & Electronics": { attendance: 86 },
  "Mechanical Engineering": { attendance: 82 },
  "Civil Engineering": { attendance: 79 },
  "Business Administration": { attendance: 89 },
  "Arts & Science": { attendance: 87 },
};
const departmentCodes = {
  "Computer Science Engineering": "CSE",
  "Information Technology": "IT",
  "Electronics & Communication": "ECE",
  "Electrical & Electronics": "EEE",
  "Mechanical Engineering": "ME",
  "Civil Engineering": "CE",
  "Business Administration": "BA",
  "Arts & Science": "AS",
};
const departmentCurriculum = {
  "Computer Science Engineering": ["Programming Fundamentals", "Data Structures", "Database Systems", "Computer Networks", "Software Engineering"],
  "Information Technology": ["Web Technologies", "Data Management", "Cloud Computing", "Information Security", "Mobile Application Development"],
  "Electronics & Communication": ["Circuit Theory", "Digital Electronics", "Signals & Systems", "Communication Systems", "Embedded Systems"],
  "Electrical & Electronics": ["Electrical Circuits", "Electromagnetic Fields", "Power Systems", "Control Systems", "Electrical Machines"],
  "Mechanical Engineering": ["Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "Machine Design", "Manufacturing Technology"],
  "Civil Engineering": ["Structural Analysis", "Surveying", "Geotechnical Engineering", "Transportation Engineering", "Environmental Engineering"],
  "Business Administration": ["Principles of Management", "Financial Accounting", "Marketing Management", "Business Analytics", "Human Resource Management"],
  "Arts & Science": ["Communication Skills", "Research Methods", "Applied Mathematics", "Data & Society", "Professional Practice"],
};
const demoStudentNames = [
  "Aarav Mehta", "Sana Khan", "Rohan Iyer", "Priya Das", "Kabir Verma",
  "Mira Nair", "Dev Patel", "Anaya Rao", "Ishaan Shah", "Tara Menon",
  "Arjun Bose", "Nisha Kumar", "Vihaan Roy", "Diya Sen", "Reyansh Paul",
  "Aditi Reddy", "Kian Joseph", "Myra Dutta", "Neil Thomas", "Sara Gupta",
];
const attendanceVariationByYear = [-2, 1, -1, 2];
const attendanceVariationByStudent = [8, 5, 3, 1, -2, -5, -11, -18];

function getCoursesForSelection(department, year) {
  const selectedDept = department || departments[0];
  if (selectedDept === departments[0] && (!year || year === academicYears[2])) return studentCourses;

  const yearIndex = Math.max(0, academicYears.indexOf(year));
  const departmentAttendance = departmentReports[selectedDept]?.attendance || 85;
  const curriculum = departmentCurriculum[selectedDept] || departmentCurriculum[departments[0]];
  const scheduleOptions = [
    "Mon, Wed · 09:00 AM",
    "Mon, Wed · 10:15 AM",
    "Mon, Thu · 12:00 PM",
    "Tue, Thu · 11:00 AM",
  ];
  const instructors = ["Dr. Anita Sharma", "Prof. Vikram Rao", "Dr. Meera Nair", "Prof. Rahul Menon"];

  return Array.from({ length: 4 }, (_, index) => {
    const curriculumIndex = (yearIndex + index) % curriculum.length;
    const title = curriculum[curriculumIndex];
    const attendance = Math.max(50, Math.min(99, departmentAttendance + attendanceVariationByYear[yearIndex] + index - 1));
    const classSchedule = scheduleOptions[index];
    const yearNumber = yearIndex + 1;
    const courseNumber = yearNumber * 100 + index + 1;

    return {
      code: `${departmentCodes[selectedDept] || "CS"} ${courseNumber}`,
      name: title,
      instructor: instructors[index],
      credits: index % 2 === 0 ? 4 : 3,
      schedule: classSchedule,
      attendance,
      classes: `${Math.round(50 * attendance / 100)} / 50`,
      nextClass: classSchedule,
      description: `Explore ${title.toLowerCase()} through core concepts, guided lessons, and practical coursework.`,
      topics: ["Core concepts", "Applied methods", "Practical coursework"],
      color: ["purple", "blue", "peach", "green"][index],
    };
  });
}

function getDepartmentStudents(department, year) {
  const departmentIndex = Math.max(0, departments.indexOf(department));
  const yearIndex = Math.max(0, academicYears.indexOf(year));
  const departmentAttendance = departmentReports[department]?.attendance || 85;
  const baseAttendance = departmentAttendance + attendanceVariationByYear[yearIndex];
  const totalClasses = 48;

  return attendanceVariationByStudent.map((variation, index) => {
    const nameIndex = (departmentIndex * 3 + yearIndex * 5 + index * 2) % demoStudentNames.length;
    const name = demoStudentNames[nameIndex];
    const attendance = Math.max(50, Math.min(99, baseAttendance + variation));
    const attended = Math.round(totalClasses * attendance / 100);
    return {
      id: `${departmentCodes[department]}-${yearIndex + 1}-${String(index + 1).padStart(3, "0")}`,
      name,
      initials: name.split(" ").map((part) => part[0]).join(""),
      attendance,
      attended,
      totalClasses,
      color: ["lavender", "peach", "mint", "blue", "yellow"][index % 5],
    };
  });
}

function getDepartmentStaff(department) {
  const staffNames = ["Anita Sharma", "Vikram Rao", "Meera Nair", "Rahul Menon", "Kavita Das", "Arun Iyer", "Neha Kapoor", "Sanjay Bose"];
  return staffNames.map((name, index) => ({
    id: `${departmentCodes[department]}-STF-${String(index + 1).padStart(3, "0")}`,
    name,
    initials: name.split(" ").map((part) => part[0]).join(""),
    attendance: `${Math.max(58, Math.min(99, departmentReports[department].attendance + attendanceVariationByStudent[index]))}%`,
    status: index === 2 ? "Late" : index === 7 ? "Absent" : "Present",
    color: ["lavender", "peach", "mint", "blue", "yellow"][index % 5],
  }));
}

function getStaffRecords(department, newStaff) {
  return [
    ...getDepartmentStaff(department),
    ...newStaff
      .filter((staff) => staff.department === department)
      .map((staff) => ({ ...staff, attendance: "0%", status: "Absent", color: "lavender" })),
  ];
}

function Avatar({ initials, color = "lavender", small = false }) {
  return <span className={`avatar ${color} ${small ? "avatar-small" : ""}`}>{initials}</span>;
}

function StatCard({ label, value, note, icon, tone, trend }) {
  return <article className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon name={icon} size={19} /></div>
    <div className="stat-copy"><span className="eyebrow">{label}</span><div className="stat-value">{value}</div><div className="stat-note">{trend && <span className="trend">{trend}</span>}{note}</div></div>
    <button className="card-more" aria-label={`More about ${label}`}><span>···</span></button>
  </article>;
}

function AttendanceRing({ value = 92 }) {
  return <div className="ring-wrap">
    <div className="ring" style={{ "--progress": `${value * 3.6}deg` }}><div className="ring-center"><strong>{value}%</strong><span>Attendance</span></div></div>
    <div className="ring-legend"><span><i className="legend-dot present-dot" />Present <b>46 days</b></span><span><i className="legend-dot absent-dot" />Absent <b>4 days</b></span></div>
  </div>;
}

function AttendanceChart() {
  const bars = [56, 73, 62, 86, 69, 92, 75, 81, 64, 89, 72, 96, 78, 88, 66, 94, 72, 84, 69, 98, 76, 91, 83, 72, 90, 79, 94, 68];
  return <div className="chart-area">
    <div className="chart-y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div>
    <div className="chart-bars">{bars.map((height, index) => <div className="bar-column" key={index}><span className={`bar ${index === 19 ? "bar-highlight" : ""}`} style={{ height: `${height}%` }} title={`${height}% attendance`} /></div>)}</div>
  </div>;
}

function Dropdown({
  value,
  onChange,
  icon = "calendar",
  label = "Year",
  placeholder = "Select",
  options = [],
  className = "",
  menuAlign = "right",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const displayText = value || placeholder;

  return (
    <div className={`custom-dropdown-container ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`department-selector custom-dropdown-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Icon name={icon} size={15} />
        <span>{label}</span>
        <span className="dropdown-selected-text">{displayText}</span>
        <Icon name="chevron" size={12} className={`dropdown-chevron-icon ${isOpen ? "rotated" : ""}`} />
      </button>

      {isOpen && (
        <div className={`custom-dropdown-menu ${menuAlign === "left" ? "align-left" : "align-right"}`} role="listbox">
          <button
            type="button"
            role="option"
            aria-selected={!value}
            className={`dropdown-menu-item ${!value ? "active" : ""}`}
            onClick={() => handleSelect("")}
          >
            <span>{placeholder}</span>
            {!value && <Icon name="check" size={13} />}
          </button>
          {options.map((option) => (
            <button
              type="button"
              key={option}
              role="option"
              aria-selected={value === option}
              className={`dropdown-menu-item ${value === option ? "active" : ""}`}
              onClick={() => handleSelect(option)}
            >
              <span>{option}</span>
              {value === option && <Icon name="check" size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function YearDropdown({ value, onChange }) {
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      icon="calendar"
      label="Year"
      placeholder="Select"
      options={academicYears}
      className="year-selector"
      menuAlign="right"
    />
  );
}

function DepartmentDropdown({ value, onChange }) {
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      icon="book"
      label="Department"
      placeholder="Choose a department"
      options={departments}
      className="department-dropdown"
      menuAlign="left"
    />
  );
}

function StudentDashboard({ department, year, onDepartmentSelect, onYearSelect }) {
  return <div className="dashboard-content">
    <div className="welcome-row"><div><p className="date-line">{currentDateLabel}</p><h1>Good morning, Aarav <span className="wave">✦</span></h1><p className="subheading">Here’s your attendance snapshot for this academic year.</p></div><div className="student-filters"><DepartmentDropdown value={department} onChange={onDepartmentSelect} /><YearDropdown value={year} onChange={onYearSelect} />
     </div></div>
    <div className="stats-grid">
      <StatCard label="Overall attendance" value="92.4%" note="above the 75% requirement" trend="+2.4%" icon="chart" tone="stat-purple" />
      <StatCard label="Classes attended" value="46 / 50" note="classes this year" icon="check" tone="stat-green" />
      <StatCard label="Days present" value="38 days" note="out of 42 working days" icon="calendar" tone="stat-peach" />
      <StatCard label="Attendance streak" value="12 days" note="you’re on a roll!" trend="Best: 18" icon="arrow" tone="stat-blue" />
    </div>
    <div className="main-grid">
      <section className="panel trend-panel">
        <div className="panel-heading"><div><h2>Attendance trend</h2><p>Your class attendance over time</p></div><button className="button button-quiet">This year <span className="chevron">⌄</span></button></div>
        <div className="chart-summary"><strong>92.4%</strong><span className="positive">↗ 4.8% <span>vs last year</span></span></div>
        <AttendanceChart />
        <div className="chart-x-labels"><span>Week 1</span><span>Week 4</span><span>Week 8</span><span>Week 12</span><span>Week 16</span></div>
      </section>
      <section className="panel overview-panel">
        <div className="panel-heading"><div><h2>Attendance overview</h2><p>{year ? `${year} · ` : ""}{currentYear}</p></div><button className="icon-button" aria-label="More options">···</button></div>
        <AttendanceRing />
        <div className="requirement-note"><span className="note-check"><Icon name="check" size={14} /></span><span><b>You’re on track</b><small>Keep it up! You can miss 8 more classes.</small></span><Icon name="arrow" size={16} /></div>
      </section>
    </div>
    <div className="lower-grid">
      <section className="panel schedule-panel">
        <div className="panel-heading"><div><h2>Today’s classes</h2><p>{currentClassDate}</p></div><button className="text-button">Full schedule <span>→</span></button></div>
        <div className="schedule-list">{schedule.map((item, index) => <div className="schedule-item" key={item.code}>
          <div className="schedule-time">{item.time}<span>{item.end}</span></div><span className={`schedule-accent ${item.color}`} />
          <div className="schedule-description"><b>{item.subject}</b><span>{item.code} <i>·</i> {item.room}</span></div>
          <span className={`class-state ${index === 0 ? "done" : ""}`}>{index === 0 ? "Attended" : index === 1 ? "In 15 min" : "Upcoming"}</span>
        </div>)}</div>
      </section>
      <section className="panel notice-panel">
        <div className="panel-heading"><div><h2>Quick reminder</h2><p>Stay ahead of your year</p></div><span className="notice-icon"><Icon name="bell" size={17} /></span></div>
        <div className="reminder-card"><span className="reminder-kicker">ATTENDANCE ALERT</span><h3>One class away from your goal</h3><p>Attend your next Computer Networks class to reach 93% attendance.</p><button className="reminder-link">View attendance details <span>→</span></button></div>
      </section>
    </div>
  </div>;
}

function MyCoursesDashboard() {
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const courses = useMemo(() => getCoursesForSelection(department, year), [department, year]);
  const averageAttendance = Math.round(courses.reduce((total, course) => total + course.attendance, 0) / courses.length);
  const totalCredits = courses.reduce((total, course) => total + course.credits, 0);

  return <div className="dashboard-content">
    <div className="welcome-row">
      <div><p className="date-line">ACADEMIC YEAR {currentAcademicYear}{year ? ` · ${year.toUpperCase()}` : ""}</p><h1>My courses <span className="wave">✦</span></h1><p className="subheading">Your enrolled courses, class schedule, and instructor details.</p></div>
      <div className="student-filters">
        <DepartmentDropdown value={department} onChange={setDepartment} />
        <YearDropdown value={year} onChange={setYear} />
      </div>
    </div>
    <div className="stats-grid">
      <StatCard label="Enrolled courses" value={courses.length} note="this semester" icon="book" tone="stat-purple" />
      <StatCard label="Credits in progress" value={totalCredits} note="across all courses" icon="chart" tone="stat-blue" />
      <StatCard label="Average attendance" value={`${averageAttendance}%`} note="across your courses" icon="calendar" tone="stat-green" />
      <StatCard label="Courses to keep on track" value={studentCourses.filter((course) => course.attendance < 75).length} note="below 75% attendance" icon="bell" tone="stat-peach" />
    </div>
    <div className="course-grid">
      {courses.map((course) => <article className="panel course-card" key={course.code}>
        <div className="course-card-heading">
          <span className={`course-mark ${course.color}`}><Icon name="book" size={18} /></span>
          <span className="course-code">{course.code}</span>
          <span className={`pill-status ${course.attendance >= 75 ? "status-good" : "status-watch"}`}>{course.attendance >= 75 ? "On track" : "Needs attention"}</span>
        </div>
        <h2>{course.name}</h2>
        <p className="course-description">{course.description}</p>
        <div className="course-detail-grid">
          <div><span>INSTRUCTOR</span><b><Icon name="people" size={14} />{course.instructor}</b></div>
          <div><span>CLASS SCHEDULE</span><b><Icon name="calendar" size={14} />{course.schedule}</b></div>
          <div><span>COURSE LOAD</span><b><Icon name="book" size={14} />{course.credits} credits</b></div>
        </div>
        <div className="course-attendance">
          <div><span>Attendance</span><b>{course.attendance}% <small>{course.classes} classes</small></b></div>
          <span className="progress-track"><span className={course.attendance >= 75 ? "purple" : "peach"} style={{ width: `${course.attendance}%` }} /></span>
        </div>
        <div className="course-topics"><span>KEY TOPICS</span><div>{course.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div>
        <div className="course-next-class"><Icon name="clock" size={15} /><span><small>NEXT CLASS</small><b>{course.nextClass}</b></span></div>
      </article>)}
    </div>
  </div>;
}

function ReportsDashboard({ newStudents = [] }) {
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");

  const selectedDept = department || departments[0];
  const students = useMemo(() => [
    ...getDepartmentStudents(selectedDept, year).map((student) => ({
      ...student,
      department: selectedDept,
      year: year || student.year,
    })),
    ...newStudents
      .filter((student) => (!department || student.department === department) && (!year || student.year === year))
      .map((student) => ({
        ...student,
        attendance: 0,
        attended: 0,
        totalClasses: 48,
        color: "lavender",
      })),
  ], [selectedDept, department, year, newStudents]);

  const allStudents = useMemo(() => {
    const records = departments.flatMap((itemDepartment) =>
      academicYears.flatMap((itemYear) =>
        getDepartmentStudents(itemDepartment, itemYear).map((student) => ({
          ...student,
          department: itemDepartment,
          year: itemYear,
        }))
      )
    );
    const addedRecords = newStudents.map((student) => ({
      ...student,
      attendance: 0,
      attended: 0,
      totalClasses: 48,
      color: "lavender",
    }));
    return [...records, ...addedRecords];
  }, [newStudents]);

  const searchValue = search.trim();
  const matchedStudent = searchValue
    ? allStudents.find((student) =>
      student.id.toLowerCase() === searchValue.toLowerCase() ||
      student.id.toLowerCase().includes(searchValue.toLowerCase())
    ) || null
    : null;
  const filteredStudents = searchValue
    ? (matchedStudent ? [matchedStudent] : [])
    : students;
  const averageAttendance = students.length
    ? Math.round(students.reduce((total, student) => total + student.attendance, 0) / students.length)
    : 0;
  const belowRequirement = students.filter((student) => student.attendance < 75).length;

  const downloadReport = () => {
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["Student Name", "Student ID", "Department", "Year", "Classes Attended", "Total Classes", "Attendance", "Status"],
      ...filteredStudents.map((student) => [
        student.name,
        student.id,
        student.department || department,
        student.year || year,
        student.attended,
        student.totalClasses,
        `${student.attendance}%`,
        student.attendance >= 75 ? "On track" : "Below 75%",
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${(departmentCodes[department] || "cs").toLowerCase()}-${(year ? year.replace(/\s+/g, "-") : "all-years").toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return <div className="dashboard-content">
    <div className="welcome-row department-page-heading">
      <div>
        <p className="date-line">ATTENDANCE REPORTS · ACADEMIC YEAR {currentAcademicYear}{year ? ` · ${year.toUpperCase()}` : ""}</p>
        <h1>Attendance reports <span className="wave">✦</span></h1>
        <p className="subheading">Choose a department and year to view the attendance register.</p>
      </div>
      <div className="student-filters">
        <DepartmentDropdown value={department} onChange={setDepartment} />
        <YearDropdown value={year} onChange={setYear} />
        <button className="button button-primary" onClick={downloadReport}><Icon name="download" size={15} /> Download report</button>
      </div>
    </div>

    <div className="stats-grid">
      <StatCard label="Students" value={students.length} note={`${department || "All departments"}${year ? ` · ${year}` : ""}`} icon="people" tone="stat-purple" />
      <StatCard label="Average attendance" value={`${averageAttendance}%`} note="for the selected report" icon="chart" tone="stat-green" />
      <StatCard label="Below 75%" value={belowRequirement} note="students need attention" icon="bell" tone="stat-peach" />
      <StatCard label="Classes tracked" value="48" note="per student this year" icon="calendar" tone="stat-blue" />
    </div>

    <section className="panel report-attendance-panel">
      <div className="panel-heading">
        <div><h2>Attendance list</h2><p>{department || "All departments"}{year ? ` · ${year}` : ""}</p></div>
        <span className="department-student-count">{filteredStudents.length} students</span>
      </div>
      <div className="table-toolbar">
        <div className="search-field"><Icon name="search" size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by student ID..." aria-label="Search attendance report by student ID" /></div>
        <button className="button button-outline" onClick={downloadReport}><Icon name="download" size={15} /> Download CSV</button>
      </div>
      {searchValue && (matchedStudent ? <article className="student-report-result">
        <div className="student-result-profile">
          <Avatar initials={matchedStudent.initials} color={matchedStudent.color} />
          <div><span>STUDENT DETAILS</span><h3>{matchedStudent.name}</h3><p>{matchedStudent.id}</p></div>
        </div>
        <div className="student-result-grid">
          <div><span>DEPARTMENT</span><b>{matchedStudent.department}</b></div>
          <div><span>YEAR</span><b>{matchedStudent.year}</b></div>
          <div><span>ATTENDANCE</span><b className={matchedStudent.attendance < 75 ? "low" : ""}>{matchedStudent.attendance}%</b></div>
          <div><span>CLASSES ATTENDED</span><b>{matchedStudent.attended} / {matchedStudent.totalClasses}</b></div>
        </div>
      </article> : <div className="empty-state student-result-empty">No student found for student ID “{searchValue}”.</div>)}
      <div className="table-scroll">
        <table>
          <thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>CLASSES ATTENDED</th><th>ATTENDANCE</th><th>STATUS</th></tr></thead>
          <tbody>{filteredStudents.map((student) => <tr key={student.id}>
            <td><div className="student-cell"><Avatar initials={student.initials} color={student.color} small /><b>{student.name}</b></div></td>
            <td className="muted-cell">{student.id}</td>
            <td className="muted-cell">{student.attended} / {student.totalClasses}</td>
            <td><div className="department-progress"><span className="progress-track"><span className={student.attendance >= 75 ? "purple" : "peach"} style={{ width: `${student.attendance}%` }} /></span><b>{student.attendance}%</b></div></td>
            <td><span className={`pill-status ${student.attendance >= 75 ? "status-good" : "status-watch"}`}>{student.attendance >= 75 ? "On track" : "Below 75%"}</span></td>
          </tr>)}</tbody>
        </table>
        {filteredStudents.length === 0 && <div className="empty-state">No students match “{search}”.</div>}
      </div>
      <div className="table-footer"><span>Showing {filteredStudents.length} of {students.length} students</span><button className="button button-primary" onClick={downloadReport}><Icon name="download" size={15} /> Download report</button></div>
    </section>
  </div>;
}

function DepartmentAttendanceDashboard({ department, year, newStudents, attendanceMarks, onSaveAttendance, onBack, onYearSelect }) {
  const [search, setSearch] = useState("");
  const [pendingAttendanceMarks, setPendingAttendanceMarks] = useState({});
  const sampleStudents = useMemo(() => getDepartmentStudents(department, year), [department, year]);
  const students = useMemo(() => [
    ...sampleStudents,
    ...newStudents
      .filter((student) => student.department === department && (!year || student.year === year))
      .map((student) => ({ ...student, attendance: 0, attended: 0, totalClasses: 0, color: "lavender" })),
  ], [sampleStudents, department, year, newStudents]);
  const addedStudentsInView = students.length - sampleStudents.length;
  const averageAttendance = Math.round(students.reduce((total, student) => total + student.attendance, 0) / (students.length || 1));
  const belowRequirement = students.filter((student) => student.attendance < 75).length;
  const searchTerm = search.trim().toLowerCase().replace(/\s+/g, " ");
  const filteredStudents = students.filter((student) => `${student.name} ${student.id}`.toLowerCase().replace(/\s+/g, " ").includes(searchTerm));
  const pendingVisibleCount = students.filter((student) => Object.prototype.hasOwnProperty.call(pendingAttendanceMarks, student.id)).length;
  const updateAttendanceDraft = (studentId, status) => setPendingAttendanceMarks((current) => {
    const updated = { ...current };
    if (attendanceMarks[studentId] === status) delete updated[studentId];
    else updated[studentId] = status;
    return updated;
  });
  const saveAttendance = () => {
    const changes = students.reduce((current, student) => {
      if (Object.prototype.hasOwnProperty.call(pendingAttendanceMarks, student.id)) current[student.id] = pendingAttendanceMarks[student.id];
      return current;
    }, {});
    if (Object.keys(changes).length === 0) return;
    onSaveAttendance(changes);
    setPendingAttendanceMarks((current) => {
      const remaining = { ...current };
      Object.keys(changes).forEach((studentId) => delete remaining[studentId]);
      return remaining;
    });
  };

  return <div className="dashboard-content">
    <div className="welcome-row department-page-heading">
      <div>
        <button className="text-button back-button" onClick={onBack}>← Back</button>
        <p className="date-line">DEPARTMENT ATTENDANCE · {(year || "ALL YEARS").toUpperCase()}</p>
        <h1>{department}</h1>
        <p className="subheading">Student attendance for {department}{year ? ` · ${year}` : ""}.</p>
      </div>
      <YearDropdown value={year} onChange={onYearSelect} />
    </div>
    <div className="stats-grid">
      <StatCard label="Students in view" value={students.length} note={`records${year ? ` · ${year}` : ""}`} icon="people" tone="stat-purple" />
      <StatCard label="Average attendance" value={`${averageAttendance}%`} note={`${department}${year ? ` · ${year}` : ""}`} icon="chart" tone="stat-green" />
      <StatCard label="Below 75% attendance" value={belowRequirement} note="students in this list" icon="bell" tone="stat-peach" />
      <StatCard label="Classes tracked" value={students[0]?.totalClasses || 48} note="per student this year" icon="book" tone="stat-blue" />
    </div>
    <section className="panel department-attendance-panel">
      <div className="panel-heading">
        <div><h2>Student attendance details</h2><p>{department}{year ? ` · ${year}` : ""}</p></div>
        <span className={`pill-status ${addedStudentsInView ? "status-good" : "status-watch"}`}>{addedStudentsInView ? `${addedStudentsInView} added` : "Sample data"}</span>
      </div>
      <div className="table-toolbar">
        <div className="search-field"><Icon name="search" size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by student name or ID..." aria-label="Search by student name or ID" /></div>
        <span className="department-student-count">Showing {filteredStudents.length} of {students.length} students</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>CLASSES ATTENDED</th><th>ATTENDANCE</th><th>STATUS</th><th>TODAY</th><th>MARK ATTENDANCE</th></tr></thead>
          <tbody>{filteredStudents.map((student) => <tr key={student.id}>
            <td><div className="student-cell"><Avatar initials={student.initials} color={student.color} small /><b>{student.name}</b></div></td>
            <td className="muted-cell">{student.id}</td>
            <td className="muted-cell">{student.attended} / {student.totalClasses}</td>
            <td><div className="department-progress"><span className="progress-track"><span className={student.attendance >= 75 ? "purple" : "peach"} style={{ width: `${student.attendance}%` }} /></span><b>{student.attendance}%</b></div></td>
            <td><span className={`pill-status ${student.attendance >= 75 ? "status-good" : "status-watch"}`}>{student.attendance >= 75 ? "On track" : "Below 75%"}</span></td>
            <td><span className={`pill-status ${(pendingAttendanceMarks[student.id] || attendanceMarks[student.id]) === "Present" ? "status-good" : (pendingAttendanceMarks[student.id] || attendanceMarks[student.id]) === "Absent" ? "status-watch" : ""}`}>{pendingAttendanceMarks[student.id] || attendanceMarks[student.id] || "Not marked"}</span></td>
            <td><div className="status-actions">{["Present", "Absent"].map((status) => {
              const selectedStatus = pendingAttendanceMarks[student.id] || attendanceMarks[student.id];
              return <button key={status} className={`status-option ${selectedStatus === status ? `selected ${status.toLowerCase()}` : ""}`} aria-label={`Mark ${status} for ${student.name}`} aria-pressed={selectedStatus === status} onClick={() => updateAttendanceDraft(student.id, status)}>{selectedStatus === status && <Icon name="check" size={13} />}{status}</button>;
            })}</div></td>
          </tr>)}</tbody>
        </table>
        {filteredStudents.length === 0 && <div className="empty-state">No students match “{search}”.</div>}
      </div>
      <div className="table-footer"><span>{pendingVisibleCount ? `${pendingVisibleCount} attendance change${pendingVisibleCount === 1 ? "" : "s"} to save` : "No unsaved attendance changes"}</span><button className="button button-primary" disabled={pendingVisibleCount === 0} onClick={saveAttendance}>Save attendance <Icon name="check" size={15} /></button></div>
      <div className="department-report-note"><span className="note-check"><Icon name="check" size={14} /></span><span><b>{averageAttendance}% average attendance{year ? ` for ${year}` : ""}</b><small>{addedStudentsInView ? "Newly added students start with 0 attended classes until attendance is recorded." : "These are sample records. Connect your college attendance data source to show live student records."}</small></span></div>
    </section>
  </div>;
}

function StaffClassSchedule() {
 const [department, setDepartment] = useState("");
 const [year, setYear] = useState("");
 const schedules = [
   { day: "Monday", time: "09:00 AM - 10:00 AM", subject: "Data Structures", code: "CS 301", year: "2nd year", room: "Room 204", color: "purple" },
   { day: "Monday", time: "10:15 AM - 11:15 AM", subject: "Database Systems", code: "CS 305", year: "3rd year", room: "Lab 03", color: "blue" },
   { day: "Tuesday", time: "11:00 AM - 12:00 PM", subject: "Operating Systems", code: "CS 312", year: "3rd year", room: "Room 108", color: "green" },
   { day: "Wednesday", time: "09:00 AM - 10:00 AM", subject: "Data Structures", code: "CS 301", year: "2nd year", room: "Room 204", color: "purple" },
   { day: "Wednesday", time: "10:15 AM - 11:15 AM", subject: "Database Systems", code: "CS 305", year: "3rd year", room: "Lab 03", color: "blue" },
   { day: "Thursday", time: "12:00 PM - 01:00 PM", subject: "Computer Networks", code: "CS 308", year: "3rd year", room: "Room 108", color: "peach" },
   { day: "Friday", time: "02:00 PM - 03:00 PM", subject: "Software Engineering", code: "CS 320", year: "4th year", room: "Room 302", color: "lavender" },
 ];
 const filteredSchedules = schedules.filter((item) => {
   if (year) return item.year === year;
   return true;
 });

 return <div className="dashboard-content">
   <div className="welcome-row department-page-heading">
     <div>
       <p className="date-line">STAFF CLASS SCHEDULE · {currentAcademicYear}</p>
       <h1>Class schedule <span className="wave">✦</span></h1>
       <p className="subheading">View your weekly teaching schedule and classroom details.</p>
     </div>
     <div className="student-filters">
       <DepartmentDropdown value={department} onChange={setDepartment} />
       <YearDropdown value={year} onChange={setYear} />
     </div>
   </div>

   <div className="stats-grid">
     <StatCard label="Weekly classes" value={filteredSchedules.length} note="classes on your timetable" icon="calendar" tone="stat-purple" />
     <StatCard label="Teaching days" value={new Set(filteredSchedules.map((item) => item.day)).size} note="days per week" icon="book" tone="stat-blue" />
     <StatCard label="Subjects" value={new Set(filteredSchedules.map((item) => item.code)).size} note="assigned courses" icon="check" tone="stat-green" />
     <StatCard label="Next class" value="09:00 AM" note={`${currentClassDate} · Room 204`} icon="clock" tone="stat-peach" />
   </div>

   <section className="panel staff-schedule-panel">
     <div className="panel-heading">
       <div><h2>Weekly timetable</h2><p>{department || "All departments"}{year ? ` · ${year}` : ""}</p></div>
       <span className="pill-status status-good">{filteredSchedules.length} scheduled classes</span>
     </div>
     <div className="staff-schedule-list">
       {filteredSchedules.map((item, index) => <article className="staff-schedule-row" key={`${item.day}-${item.code}-${index}`}>
         <div className="staff-schedule-day"><b>{item.day}</b><span>{item.time}</span></div>
         <span className={`schedule-accent ${item.color}`} />
         <div className="staff-schedule-class">
           <b>{item.subject}</b>
           <span>{item.code} · {item.year} · {item.room}</span>
         </div>
         <span className="pill-status status-good">Scheduled</span>
       </article>)}
     </div>
     {filteredSchedules.length === 0 && <div className="empty-state">No classes scheduled for the selected department and year.</div>}
   </section>
 </div>;
}

function StaffDashboard({ newStaff }) {
  const [department, setDepartment] = useState(departments[0]);
  const [records, setRecords] = useState(() => getStaffRecords(departments[0], newStaff));
  const [search, setSearch] = useState("");
  const filtered = records.filter((student) => `${student.name} ${student.id}`.toLowerCase().includes(search.toLowerCase()));
  const mark = (id, status) => setRecords((current) => current.map((student) => student.id === id ? { ...student, status } : student));
  const present = records.filter((student) => student.status === "Present").length;
  const needAttention = records.filter((student) => parseInt(student.attendance, 10) < 75).length;
  const absent = records.filter((student) => student.status === "Absent").length;
  const updateDepartment = (nextDepartment) => {
    setDepartment(nextDepartment);
    setRecords(getStaffRecords(nextDepartment, newStaff));
    setSearch("");
  };
  return <div className="dashboard-content">
    <div className="welcome-row"><div><p className="date-line">{currentDateLabel}</p><h1>Good morning, Professor <span className="wave">✦</span></h1><p className="subheading">Manage your department’s staff attendance.</p></div><button className="button button-primary"><Icon name="download" size={16} /> Export report</button></div>
    <div className="stats-grid">
      <StatCard label="Staff members" value={records.length} note={department} icon="people" tone="stat-purple" />
      <StatCard label="Present today" value={present} note="staff marked present" icon="check" tone="stat-green" />
      <StatCard label="Absent today" value={absent} note="staff marked absent" icon="calendar" tone="stat-peach" />
      <StatCard label="Need attention" value={`${needAttention} staff`} note="below 75% attendance" icon="bell" tone="stat-blue" />
    </div>
    <section className="panel staff-class-panel">
      <div className="panel-heading staff-heading"><div><h2>Staff attendance</h2><p>Record today’s attendance for department staff</p></div><button className="button button-outline"><Icon name="calendar" size={16} /> {currentShortDate} <span className="chevron">⌄</span></button></div>
      <div className="class-select-row staff-class-select-row">
        <div className="select-card"><span className="select-label">SELECTED DEPARTMENT</span><b>{department}</b><small>Staff attendance register</small></div>
        <div className="staff-selection-controls">
          <label className="staff-filter"><span>DEPARTMENT</span><select aria-label="Select staff department" value={department} onChange={(event) => updateDepartment(event.target.value)}>{departments.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>
        <div className="class-meta"><span><Icon name="people" size={15} /> {records.length} staff members</span></div>
      </div>
      <div className="table-toolbar"><div className="search-field"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search staff..." aria-label="Search staff" /></div><div className="attendance-legend"><span><i className="legend-dot present-dot" />Present {present}</span><span><i className="legend-dot late-dot" />Late {records.filter((item) => item.status === "Late").length}</span><span><i className="legend-dot absent-dot" />Absent {absent}</span></div></div>
      <div className="table-scroll"><table><thead><tr><th>STAFF</th><th>STAFF ID</th><th>ATTENDANCE</th><th>MARK STATUS</th></tr></thead><tbody>{filtered.map((staff) => <tr key={staff.id}><td><div className="student-cell"><Avatar initials={staff.initials} color={staff.color} small /><b>{staff.name}</b></div></td><td className="muted-cell">{staff.id}</td><td><span className={`attendance-percent ${parseInt(staff.attendance, 10) < 75 ? "low" : ""}`}>{staff.attendance}</span></td><td><div className="status-actions">{["Present", "Late", "Absent"].map((status) => <button key={status} className={`status-option ${staff.status === status ? `selected ${status.toLowerCase()}` : ""}`} onClick={() => mark(staff.id, status)}>{staff.status === status && <Icon name="check" size={13} />}{status}</button>)}</div></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No staff match “{search}”.</div>}</div>
      <div className="table-footer"><span>Showing {filtered.length} of {records.length} staff members</span><button className="button button-primary" onClick={() => window.alert(`Staff attendance saved for ${department}.`)}>Save attendance <Icon name="check" size={15} /></button></div>
    </section>
  </div>;
}

function AdminDashboard({ newStudents, newStaff, onAddStudent, onAddStaff }) {
  const [department, setDepartment] = useState("All departments");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentDepartment, setStudentDepartment] = useState(departments[0]);
  const [studentYear, setStudentYear] = useState(academicYears[0]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffDepartment, setStaffDepartment] = useState(departments[0]);
  const departmentRows = [
    { name: "Computer Science", code: "CSE", students: "1,240", attendance: 91, color: "purple" },
    { name: "Information Technology", code: "IT", students: "860", attendance: 88, color: "blue" },
    { name: "Electronics & Communication", code: "ECE", students: "920", attendance: 84, color: "peach" },
    { name: "Mechanical Engineering", code: "ME", students: "740", attendance: 79, color: "green" },
    { name: "Electrical & Electronics", code: "EEE", students: "—", attendance: 86, color: "blue" },
    { name: "Civil Engineering", code: "CE", students: "—", attendance: 79, color: "green" },
    { name: "Business Administration", code: "BA", students: "—", attendance: 89, color: "purple" },
    { name: "Arts & Science", code: "AS", students: "—", attendance: 87, color: "peach" },
  ];
  const filteredRows = useMemo(() => departmentRows.filter((row) => department === "All departments" || row.name === department), [department]);
  const addStudent = (event) => {
    event.preventDefault();
    const name = studentName.trim();
    if (!name) return;
    onAddStudent({
      name,
      department: studentDepartment,
      year: studentYear,
      initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    });
    setStudentName("");
    setShowAddStudent(false);
  };
  const addStaff = (event) => {
    event.preventDefault();
    const name = staffName.trim();
    if (!name) return;
    onAddStaff({
      name,
      department: staffDepartment,
      initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    });
    setStaffName("");
    setShowAddStaff(false);
  };
  return <div className="dashboard-content">
    <div className="welcome-row"><div><p className="date-line">{currentDateLabel}</p><h1>Campus overview <span className="wave">✦</span></h1><p className="subheading">Here’s what’s happening across your campus today.</p></div><div className="admin-heading-actions"><button className="button button-primary" onClick={() => setShowAddStudent(true)}><Icon name="people" size={16} /> Add student</button><button className="button button-outline" onClick={() => setShowAddStaff(true)}><Icon name="people" size={16} /> Add staff</button><button className="button button-outline"><Icon name="calendar" size={16} /> This semester <span className="chevron">⌄</span></button></div></div>
    <div className="stats-grid">
      <StatCard label="Total students" value="3,760" note="sample enrollment · 4 departments" trend="+4.2%" icon="people" tone="stat-purple" />
      <StatCard label="Faculty members" value="184" note="teaching this semester" icon="book" tone="stat-blue" />
      <StatCard label="Average attendance" value="86.8%" note="campus-wide this semester" trend="+1.8%" icon="chart" tone="stat-green" />
      <StatCard label="Classes today" value="246" note="across all departments" icon="calendar" tone="stat-peach" />
    </div>
    <div className="main-grid admin-main-grid">
      <section className="panel trend-panel">
        <div className="panel-heading"><div><h2>Campus attendance</h2><p>Average student attendance over the semester</p></div><button className="button button-quiet">{currentAcademicYear} <span className="chevron">⌄</span></button></div>
        <div className="chart-summary"><strong>86.8%</strong><span className="positive">↗ 1.8% <span>vs last semester</span></span></div>
        <AttendanceChart />
        <div className="chart-x-labels"><span>Week 1</span><span>Week 4</span><span>Week 8</span><span>Week 12</span><span>Week 16</span></div>
      </section>
      <section className="panel overview-panel">
        <div className="panel-heading"><div><h2>Attendance distribution</h2><p>Students by attendance range</p></div><button className="icon-button" aria-label="More options">···</button></div>
        <div className="distribution-list">{[{ name: "Above 90%", count: "1,842", percent: 49, tone: "purple" }, { name: "75% – 90%", count: "1,316", percent: 35, tone: "blue" }, { name: "Below 75%", count: "602", percent: 16, tone: "peach" }].map((item) => <div className="distribution-item" key={item.name}><div><span>{item.name}</span><b>{item.count}</b></div><div className="progress-track"><span className={item.tone} style={{ width: `${item.percent}%` }} /></div></div>)}</div>
        <button className="requirement-note admin-alert"><span className="note-alert">!</span><span><b>602 students need attention</b><small>Below the 75% attendance requirement</small></span><Icon name="arrow" size={16} /></button>
      </section>
    </div>
    <section className="panel departments-panel">
      <div className="panel-heading"><div><h2>Department overview</h2><p>Attendance by department; enrollment shown where available</p></div><button className="button button-outline"><Icon name="download" size={15} /> Export data</button></div>
      <div className="table-toolbar"><select className="filter-select" value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filter by department"><option>All departments</option>{departmentRows.map((row) => <option key={row.code}>{row.name}</option>)}</select></div>
      <div className="table-scroll"><table><thead><tr><th>DEPARTMENT</th><th>STUDENTS</th><th>AVERAGE ATTENDANCE</th><th>STATUS</th></tr></thead><tbody>{filteredRows.map((row) => <tr key={row.code}><td><div className="department-cell"><span className={`department-mark ${row.color}`}>{row.code.slice(0, 2)}</span><b>{row.name}</b></div></td><td className="muted-cell">{row.students}</td><td><div className="department-progress"><span className="progress-track"><span className={row.color} style={{ width: `${row.attendance}%` }} /></span><b>{row.attendance}%</b></div></td><td><span className={`pill-status ${row.attendance >= 85 ? "status-good" : "status-watch"}`}>{row.attendance >= 85 ? "On track" : "Needs focus"}</span></td></tr>)}</tbody></table>{filteredRows.length === 0 && <div className="empty-state">No departments match the selected filter.</div>}</div>
    </section>
    {newStudents.length > 0 && <section className="panel recent-students-panel">
      <div className="panel-heading"><div><h2>Recently added students</h2><p>New registrations added by the admin</p></div><span className="department-student-count">{newStudents.length} added</span></div>
      <div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>DEPARTMENT</th><th>YEAR</th></tr></thead><tbody>{newStudents.map((student) => <tr key={student.id}><td><div className="student-cell"><Avatar initials={student.initials} color="lavender" small /><b>{student.name}</b></div></td><td className="muted-cell">{student.id}</td><td className="muted-cell">{student.department}</td><td><span className="pill-status status-good">{student.year}</span></td></tr>)}</tbody></table></div>
    </section>}
    {newStaff.length > 0 && <section className="panel recent-students-panel">
      <div className="panel-heading"><div><h2>Recently added staff</h2><p>New staff registrations added by the admin</p></div><span className="department-student-count">{newStaff.length} added</span></div>
      <div className="table-scroll"><table><thead><tr><th>STAFF</th><th>STAFF ID</th><th>DEPARTMENT</th></tr></thead><tbody>{newStaff.map((staff) => <tr key={staff.id}><td><div className="student-cell"><Avatar initials={staff.initials} color="lavender" small /><b>{staff.name}</b></div></td><td className="muted-cell">{staff.id}</td><td className="muted-cell">{staff.department}</td></tr>)}</tbody></table></div>
    </section>}
    {showAddStaff && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddStaff(false); }}>
      <div className="student-modal" role="dialog" aria-modal="true" aria-labelledby="add-staff-title">
        <div className="modal-heading"><div><h2 id="add-staff-title">Add new staff</h2><p>Register a staff member for a department.</p></div><button className="icon-button" type="button" onClick={() => setShowAddStaff(false)} aria-label="Close add staff form">×</button></div>
        <form onSubmit={addStaff}>
          <label className="student-form-field"><span>Staff name</span><input value={staffName} onChange={(event) => setStaffName(event.target.value)} placeholder="Enter full name" autoFocus required /></label>
          <label className="student-form-field"><span>Department</span><select value={staffDepartment} onChange={(event) => setStaffDepartment(event.target.value)}>{departments.map((item) => <option key={item}>{item}</option>)}</select></label>
          <div className="modal-actions"><button className="button button-outline" type="button" onClick={() => setShowAddStaff(false)}>Cancel</button><button className="button button-primary" type="submit"><Icon name="check" size={15} /> Add staff</button></div>
        </form>
      </div>
    </div>}
    {showAddStudent && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddStudent(false); }}>
      <div className="student-modal" role="dialog" aria-modal="true" aria-labelledby="add-student-title">
        <div className="modal-heading"><div><h2 id="add-student-title">Add new student</h2><p>Register a student for a department and academic year.</p></div><button className="icon-button" type="button" onClick={() => setShowAddStudent(false)} aria-label="Close add student form">×</button></div>
        <form onSubmit={addStudent}>
          <label className="student-form-field"><span>Student name</span><input value={studentName} onChange={(event) => setStudentName(event.target.value)} placeholder="Enter full name" autoFocus required /></label>
          <label className="student-form-field"><span>Department</span><select value={studentDepartment} onChange={(event) => setStudentDepartment(event.target.value)}>{departments.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="student-form-field"><span>Year</span><select value={studentYear} onChange={(event) => setStudentYear(event.target.value)}><option value="">Select year</option>{academicYears.map((item) => <option key={item}>{item}</option>)}</select></label>
          <div className="modal-actions"><button className="button button-outline" type="button" onClick={() => setShowAddStudent(false)}>Cancel</button><button className="button button-primary" type="submit"><Icon name="check" size={15} /> Add student</button></div>
        </form>
      </div>
    </div>}
  </div>;
}

const navByRole = {
  Student: [["grid", "Overview"], ["calendar", "My attendance"], ["book", "My courses"], ["chart", "Reports"]],
  Staff: [["grid", "Overview"], ["check", "Mark attendance"], ["calendar", "Class schedule"], ["people", "My students"], ["chart", "Reports"]],
  Admin: [["grid", "Overview"], ["people", "Students"], ["people", "Staff"], ["book", "Departments"], ["chart", "Analytics"], ["settings", "Settings"]],
};

function App() {
  const [role, setRole] = useState("Student");
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [newStudents, setNewStudents] = useState([]);
  const [newStaff, setNewStaff] = useState([]);
  const [studentAttendanceMarks, setStudentAttendanceMarks] = useState({});
  const [showDepartmentAttendance, setShowDepartmentAttendance] = useState(false);
  const addStudent = (student) => setNewStudents((current) => {
    const studentSequence = current.filter((item) => item.department === student.department && item.year === student.year).length + 1;
    const departmentCode = departmentCodes[student.department] || "CS";
    const yearIndex = Math.max(0, academicYears.indexOf(student.year)) + 1;
    return [{ ...student, id: `${departmentCode}-${yearIndex}-NEW-${String(studentSequence).padStart(3, "0")}` }, ...current];
  });
  const addStaff = (staff) => setNewStaff((current) => {
    const staffSequence = current.filter((item) => item.department === staff.department).length + 1;
    const departmentCode = departmentCodes[staff.department];
    return [{ ...staff, id: `${departmentCode}-STF-NEW-${String(staffSequence).padStart(3, "0")}` }, ...current];
  });
  const saveStudentAttendance = (changes) => setStudentAttendanceMarks((current) => ({ ...current, ...changes }));
  const selectDepartment = (nextDepartment) => {
    if (!nextDepartment) return;
    setDepartment(nextDepartment);
    setShowDepartmentAttendance(true);
    setActiveNav(nextDepartment);
  };
  const returnToStudentDashboard = () => {
    setShowDepartmentAttendance(false);
    setDepartment("");
    setActiveNav("Overview");
  };
  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
      <a className="brand" href="#" onClick={(event) => event.preventDefault()}><span className="brand-mark"><span /></span><span>classroom<span className="brand-dot">.</span><small>CAMPUS PORTAL</small></span></a>
      <div className="campus-switcher"><div className="campus-crest">T</div><div><b>TopTech</b><span>Main campus</span></div><span className="chevron">⌄</span></div>
      <span className="nav-caption">WORKSPACE</span>
      <nav className="main-nav" aria-label="Main navigation">{navByRole[role].map(([icon, label]) => <button className={`nav-item ${activeNav === label ? "active" : ""}`} key={label} onClick={() => { setActiveNav(label); setMobileMenu(false); }}><Icon name={icon} size={18} /><span>{label}</span>{label === "Mark attendance" && <span className="nav-badge">4</span>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="help-card"><span className="help-spark">✳</span><b>Need a hand?</b><p>Visit our help center for quick answers.</p><button>Open help center <span>↗</span></button></div>
        <button className="nav-item settings-link"><Icon name="settings" size={18} /><span>Settings</span></button>
        <div className="profile-card"><Avatar initials={role === "Student" ? "AM" : role === "Staff" ? "PS" : "AD"} color="lavender" /><span><b>{role === "Student" ? "Aarav Mehta" : role === "Staff" ? "Prof. Sharma" : "Admin User"}</b><small>{role === "Student" ? "Student · CS, Sem 5" : role === "Staff" ? "Faculty · Computer Science" : "Administrator"}</small></span><button className="profile-menu" aria-label="Profile options">···</button></div>
      </div>
    </aside>
    {mobileMenu && <button className="sidebar-scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}
    <main className="main-content">
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation"><span /><span /><span /></button>
          <div className="breadcrumb">Campus portal <span>/</span> <b>{activeNav}</b></div>
        </div>
        <div className="topbar-actions">
          <div className="role-switcher" aria-label="Dashboard role">
            {["Student", "Staff", "Admin"].map((item) => <button
              key={item}
              className={role === item ? "selected" : ""}
              onClick={() => {
                setRole(item);
                setActiveNav("Overview");
                setShowDepartmentAttendance(false);
                setMobileMenu(false);
              }}
            >{item}</button>)}
          </div>
          <button className="top-icon-button" aria-label="Search"><Icon name="search" size={18} /></button>
          <button className="top-icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={18} /><i /></button>
          <span className="topbar-divider" />
          <Avatar initials={role === "Student" ? "AM" : role === "Staff" ? "PS" : "AD"} color="lavender" small />
        </div>
      </header>
      {role === "Student" && showDepartmentAttendance
        ? <DepartmentAttendanceDashboard department={department} year={year} newStudents={newStudents} attendanceMarks={studentAttendanceMarks} onSaveAttendance={saveStudentAttendance} onBack={returnToStudentDashboard} onYearSelect={setYear} />
        : role === "Student" && activeNav === "My courses"
          ? <MyCoursesDashboard />
        : (activeNav === "Reports" || activeNav === "Analytics")
          ? <ReportsDashboard newStudents={newStudents} />
        : role === "Staff" && activeNav === "Class schedule"
          ? <StaffClassSchedule />
        : role === "Student"
          ? <StudentDashboard department={department} year={year} onDepartmentSelect={selectDepartment} onYearSelect={setYear} />
          : role === "Staff" ? <StaffDashboard newStaff={newStaff} /> : <AdminDashboard newStudents={newStudents} newStaff={newStaff} onAddStudent={addStudent} onAddStaff={addStaff} />}
      <footer className="page-footer"><span>© {currentYear} TopTech</span><span>Made for better learning <i>✦</i></span></footer>
    </main>
  </div>;
}

export default App;
