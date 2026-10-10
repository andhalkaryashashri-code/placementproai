import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentPerformance from "../pages/student/StudentPerformance";

import Home from "../pages/home";
import About from "../pages/about";
import Companies from "../pages/companies";
import Contact from "../pages/contact";

import Prediction from "../pages/teacher/Prediction";
import CodingPractice from "../pages/student/tools/CodingPractice";

import Login from "../pages/login";
import Register from "../pages/register";

import AdminStudents from "../pages/admin/Students";

import ResumeBuilder from "../pages/student/tools/ResumeBuilder";
import MockInterview from "../pages/student/tools/MockInterview";

import Student from "../pages/student";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentTests from "../pages/student/StudentTests";
import TestAttempt from "../pages/student/TestAttempt";
import SubjectDetails from "../pages/student/subjects/SubjectDetails";

import Teacher from "../pages/teacher";
import TeacherLogin from "../pages/teacher/teacherlogin";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import Students from "../pages/teacher/Students";
import AddTest from "../pages/teacher/AddTest";
import AddQuestion from "../pages/teacher/AddQuestion";
import EditQuestion from "../pages/teacher/EditQuestion";
import ManageQuestions from "../pages/teacher/ManageQuestions";
import ViewQuestions from "../pages/teacher/ViewQuestions";
import Performance from "../pages/teacher/Performance";
import ProgressReport from "../pages/teacher/ProgressReport";

import Admin from "../pages/admin";
import AdminLogin from "../pages/admin/adminlogin";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =====================================================
            PUBLIC
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================================
            ADMIN STUDENTS
        ===================================================== */}

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <AdminStudents />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT PERFORMANCE
            Student sees own performance
        ===================================================== */}

        <Route
          path="/student/performance"
          element={
            <ProtectedRoute role="student">
              <StudentPerformance />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TEACHER VIEW STUDENT PROGRESS
            Teacher sees selected student's performance
        ===================================================== */}

        <Route
          path="/teacher/student-progress/:studentId"
          element={
            <ProtectedRoute role="teacher">
              <StudentPerformance />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT RESUME
        ===================================================== */}

        <Route
          path="/student/resume-builder"
          element={
            <ProtectedRoute role="student">
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT MOCK INTERVIEW
        ===================================================== */}

        <Route
          path="/student/mock-interview"
          element={
            <ProtectedRoute role="student">
              <MockInterview />
            </ProtectedRoute>
          }
        />

<Route
  path="/teacher/prediction"
  element={
    <ProtectedRoute role="teacher">
      <Prediction />
    </ProtectedRoute>
  }
/>


        {/* =====================================================
            STUDENT
        ===================================================== */}

        <Route
          path="/student"
          element={<Student />}
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/tests"
          element={
            <ProtectedRoute role="student">
              <StudentTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/coding-practice"
          element={
            <ProtectedRoute role="student">
              <CodingPractice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aptitude/:id"
          element={
            <ProtectedRoute role="student">
              <TestAttempt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/subject/:subjectName"
          element={
            <ProtectedRoute role="student">
              <SubjectDetails />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TEACHER
        ===================================================== */}

        <Route
          path="/teacher"
          element={<Teacher />}
        />

        <Route
          path="/teacher/login"
          element={<TeacherLogin />}
        />

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute role="teacher">
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/add-test"
          element={
            <ProtectedRoute role="teacher">
              <AddTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/add-question/:testId"
          element={
            <ProtectedRoute role="teacher">
              <AddQuestion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/manage-questions"
          element={
            <ProtectedRoute role="teacher">
              <ManageQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/questions/:testId"
          element={
            <ProtectedRoute role="teacher">
              <ViewQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/edit-question/:id"
          element={
            <ProtectedRoute role="teacher">
              <EditQuestion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/performance"
          element={
            <ProtectedRoute role="teacher">
              <Performance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/result/:testId"
          element={
            <ProtectedRoute role="teacher">
              <Performance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/progress-report/:testId"
          element={
            <ProtectedRoute role="teacher">
              <ProgressReport />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN
        ===================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default AppRoutes;