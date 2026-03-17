import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AttemptQuiz from "./pages/AttemptQuiz";
import CreateQuiz from "./pages/CreateQuiz";
import DailyFact from "./pages/DailyFact";
import Games from "./pages/Games";
import Groups from "./pages/Groups";
import LeaderboardPage from "./pages/LeaderboardPage";
import Login from "./pages/Login";
import Materials from "./pages/Materials";
import NewsFeed from "./pages/NewsFeed";
import Register from "./pages/Register";
import Result from "./pages/Result";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import UpdateQuiz from "./pages/UpdateQuiz";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attempt/:quizId"
        element={
          <ProtectedRoute role="student">
            <AttemptQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute role="student">
            <Result />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results/:resultId"
        element={
          <ProtectedRoute role="student">
            <Result />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/leaderboard"
        element={
          <ProtectedRoute role="student">
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/materials"
        element={
          <ProtectedRoute role="student">
            <Materials />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/groups"
        element={
          <ProtectedRoute role="student">
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/news"
        element={
          <ProtectedRoute role="student">
            <NewsFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/facts"
        element={
          <ProtectedRoute role="student">
            <DailyFact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/games"
        element={
          <ProtectedRoute role="student">
            <Games />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/create-quiz"
        element={
          <ProtectedRoute role="teacher">
            <CreateQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/update-quiz/:quizId"
        element={
          <ProtectedRoute role="teacher">
            <UpdateQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/results/:quizId"
        element={
          <ProtectedRoute role="teacher">
            <Result />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/result/:resultId"
        element={
          <ProtectedRoute role="teacher">
            <Result />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/leaderboard"
        element={
          <ProtectedRoute role="teacher">
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/materials"
        element={
          <ProtectedRoute role="teacher">
            <Materials />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/groups"
        element={
          <ProtectedRoute role="teacher">
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/news"
        element={
          <ProtectedRoute role="teacher">
            <NewsFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/facts"
        element={
          <ProtectedRoute role="teacher">
            <DailyFact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/games"
        element={
          <ProtectedRoute role="teacher">
            <Games />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <div className="page-shell">
            <main className="page-main min-h-screen flex items-center justify-center">
              <section className="panel panel-pad max-w-md text-center">
                <h1 className="hero-title">404 - Page Not Found</h1>
                <p className="hero-subtitle mt-2">
                  The page you are trying to access does not exist in this route map.
                </p>
              </section>
            </main>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
