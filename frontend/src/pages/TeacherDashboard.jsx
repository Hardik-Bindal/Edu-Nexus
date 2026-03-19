import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import { deleteQuiz, getQuizzes } from "../services/quizService";
import { getUser } from "../services/session";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [mounted, setMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    setMounted(true);
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getQuizzes();
      setQuizzes(data || []);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await deleteQuiz(quizId);
      setMessage("Quiz deleted successfully.");
      setMessageType("success");
      setDeleteConfirm(null);
      loadQuizzes();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    {
      label: "Total Quizzes",
      value: quizzes.length,
      icon: (
        <svg className="td-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: "cyan",
    },
    {
      label: "Active Students",
      value: quizzes.length > 0 ? `${quizzes.length * 3}+` : "0",
      icon: (
        <svg className="td-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "purple",
    },
    {
      label: "Submissions",
      value: quizzes.length > 0 ? `${quizzes.length * 5}+` : "0",
      icon: (
        <svg className="td-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green",
    },
    {
      label: "Avg Score",
      value: "N/A",
      icon: (
        <svg className="td-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "orange",
    },
  ];

  const quickActions = [
    { label: "Create Quiz", to: "/teacher/create-quiz", icon: "➕", primary: true },
    { label: "Leaderboard", to: "/teacher/leaderboard", icon: "🏆" },
    { label: "Materials", to: "/teacher/materials", icon: "📚" },
    { label: "Groups", to: "/teacher/groups", icon: "👥" },
    { label: "News", to: "/teacher/news", icon: "📰" },
    { label: "Facts", to: "/teacher/facts", icon: "💡" },
    { label: "Games", to: "/teacher/games", icon: "🎮" },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "td-difficulty-easy";
      case "medium":
        return "td-difficulty-medium";
      case "hard":
        return "td-difficulty-hard";
      default:
        return "td-difficulty-medium";
    }
  };

  return (
    <>
      <style>{`
        /* ===========================================
           EDUNEXUS TEACHER DASHBOARD - LIGHT SOFT THEME
           =========================================== */

        .td-page {
          min-height: 100vh;
          background: #f4f6fb;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background */
        .td-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .td-bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.07), transparent),
            radial-gradient(ellipse 50% 50% at 90% 20%, rgba(236, 72, 153, 0.05), transparent),
            radial-gradient(ellipse 50% 50% at 10% 80%, rgba(6, 182, 212, 0.05), transparent);
        }

        .td-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(100, 116, 139, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
        }

        .td-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          animation: td-orb-float 25s ease-in-out infinite;
        }

        .td-bg-orb-1 {
          width: 500px;
          height: 500px;
          background: rgba(139, 92, 246, 0.08);
          top: -100px;
          right: -100px;
        }

        .td-bg-orb-2 {
          width: 400px;
          height: 400px;
          background: rgba(236, 72, 153, 0.06);
          bottom: -100px;
          left: -100px;
          animation-delay: -10s;
        }

        .td-bg-orb-3 {
          width: 300px;
          height: 300px;
          background: rgba(6, 182, 212, 0.05);
          top: 50%;
          left: 30%;
          animation-delay: -15s;
        }

        @keyframes td-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }


        /* Main Content */

        .td-main {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .td-main.td-mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hero Section */
        .td-hero {
          margin-bottom: 2rem;
        }

        .td-hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .td-hero-content {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
          }
        }

        .td-hero-text {
          max-width: 600px;
        }

        .td-hero-greeting {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.18);
          border-radius: 100px;
          font-size: 0.875rem;
          color: #7c3aed;
          margin-bottom: 1rem;
        }

        .td-hero-greeting-dot {
          width: 8px;
          height: 8px;
          background: #7c3aed;
          border-radius: 50%;
          animation: td-pulse 2s ease-in-out infinite;
        }

        @keyframes td-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .td-hero-title {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        @media (min-width: 768px) {
          .td-hero-title {
            font-size: 2.75rem;
          }
        }

        .td-hero-title-highlight {
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .td-hero-subtitle {
          font-size: 1.0625rem;
          color: #64748b;
          line-height: 1.6;
        }

        .td-hero-date {
          font-size: 0.875rem;
          color: #94a3b8;
          margin-top: 1rem;
        }

        .td-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .td-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
        }

        .td-btn svg {
          width: 18px;
          height: 18px;
        }

        .td-btn-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .td-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .td-btn-primary:hover::before {
          opacity: 1;
        }

        .td-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -8px rgba(139, 92, 246, 0.4);
        }

        .td-btn-primary span {
          position: relative;
          z-index: 1;
        }

        .td-btn-secondary {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(100, 116, 139, 0.18);
          color: #334155;
        }

        .td-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(100, 116, 139, 0.28);
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.08);
        }

        /* Stats Grid */
        .td-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .td-stats {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .td-stat-card {
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(100, 116, 139, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
          animation: td-fade-up 0.5s ease backwards;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .td-stat-card:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(100, 116, 139, 0.18);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(100, 116, 139, 0.08);
        }

        @keyframes td-fade-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
        }

        .td-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .td-stat-icon-wrap {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .td-stat-icon-wrap.cyan {
          background: rgba(6, 182, 212, 0.1);
          color: #0891b2;
        }

        .td-stat-icon-wrap.purple {
          background: rgba(139, 92, 246, 0.1);
          color: #7c3aed;
        }

        .td-stat-icon-wrap.green {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .td-stat-icon-wrap.orange {
          background: rgba(251, 146, 60, 0.1);
          color: #ea580c;
        }

        .td-stat-icon {
          width: 20px;
          height: 20px;
        }

        .td-stat-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }

        .td-stat-label {
          font-size: 0.8125rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        /* Message/Alert */
        .td-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          animation: td-fade-up 0.3s ease;
        }

        .td-message svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .td-message-info {
          background: rgba(6, 182, 212, 0.06);
          border: 1px solid rgba(6, 182, 212, 0.15);
          color: #0891b2;
        }

        .td-message-success {
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.15);
          color: #059669;
        }

        .td-message-error {
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #dc2626;
        }

        /* Main Layout */
        .td-layout {
          display: grid;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .td-layout {
            grid-template-columns: 1.6fr 1fr;
          }
        }

        /* Section Panels */
        .td-panel {
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(100, 116, 139, 0.1);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 1px 3px rgba(100, 116, 139, 0.04);
        }

        .td-panel-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(100, 116, 139, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .td-panel-title {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .td-panel-title-icon {
          font-size: 1.25rem;
        }

        .td-panel-badge {
          padding: 0.25rem 0.75rem;
          background: rgba(139, 92, 246, 0.08);
          border-radius: 100px;
          font-size: 0.75rem;
          color: #7c3aed;
          font-weight: 500;
        }

        .td-panel-body {
          padding: 1rem;
        }

        .td-panel-empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: #64748b;
        }

        .td-panel-empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          color: #94a3b8;
        }

        /* Quiz Cards */
        .td-quiz-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .td-quiz-card {
          padding: 1.25rem;
          background: rgba(248, 250, 252, 0.9);
          border: 1px solid rgba(100, 116, 139, 0.08);
          border-radius: 14px;
          transition: all 0.3s ease;
          animation: td-fade-up 0.4s ease backwards;
        }

        .td-quiz-card:hover {
          background: #ffffff;
          border-color: rgba(139, 92, 246, 0.25);
          box-shadow: 0 4px 16px rgba(100, 116, 139, 0.08);
        }

        .td-quiz-card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .td-quiz-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          border-radius: 12px;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .td-quiz-info {
          flex: 1;
          min-width: 0;
        }

        .td-quiz-title {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.0625rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.375rem;
        }

        .td-quiz-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: #64748b;
        }

        .td-quiz-meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .td-quiz-meta-item svg {
          width: 14px;
          height: 14px;
        }

        .td-difficulty {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .td-difficulty-easy {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .td-difficulty-medium {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .td-difficulty-hard {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .td-quiz-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .td-quiz-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .td-quiz-btn svg {
          width: 14px;
          height: 14px;
        }

        .td-quiz-btn-view {
          background: rgba(6, 182, 212, 0.1);
          color: #0891b2;
        }

        .td-quiz-btn-view:hover {
          background: rgba(6, 182, 212, 0.18);
        }

        .td-quiz-btn-edit {
          background: rgba(139, 92, 246, 0.1);
          color: #7c3aed;
        }

        .td-quiz-btn-edit:hover {
          background: rgba(139, 92, 246, 0.18);
        }

        .td-quiz-btn-delete {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .td-quiz-btn-delete:hover {
          background: rgba(239, 68, 68, 0.18);
        }

        /* Quick Actions */
        .td-quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          padding: 1rem;
        }

        .td-quick-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0.75rem;
          background: rgba(248, 250, 252, 0.9);
          border: 1px solid rgba(100, 116, 139, 0.08);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .td-quick-btn:hover {
          background: #ffffff;
          border-color: rgba(139, 92, 246, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(100, 116, 139, 0.08);
        }

        .td-quick-btn-primary {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
          border-color: rgba(139, 92, 246, 0.2);
        }

        .td-quick-btn-icon {
          font-size: 1.5rem;
        }

        .td-quick-btn-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
        }

        /* Loading State */
        .td-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 3rem;
          color: #7c3aed;
        }

        .td-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: td-spin 1s linear infinite;
        }

        @keyframes td-spin {
          to { transform: rotate(360deg); }
        }

        /* Delete Confirmation Modal */
        .td-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: td-modal-fade 0.2s ease;
        }

        @keyframes td-modal-fade {
          from { opacity: 0; }
        }

        .td-modal {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          border: 1px solid rgba(100, 116, 139, 0.12);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
          animation: td-modal-scale 0.3s ease;
        }

        @keyframes td-modal-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .td-modal-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.08);
          border-radius: 50%;
          color: #dc2626;
        }

        .td-modal-icon svg {
          width: 28px;
          height: 28px;
        }

        .td-modal-title {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .td-modal-text {
          font-size: 0.9375rem;
          color: #64748b;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .td-modal-actions {
          display: flex;
          gap: 0.75rem;
        }

        .td-modal-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .td-modal-btn-cancel {
          background: rgba(100, 116, 139, 0.08);
          color: #334155;
        }

        .td-modal-btn-cancel:hover {
          background: rgba(100, 116, 139, 0.14);
        }

        .td-modal-btn-delete {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .td-modal-btn-delete:hover {
          box-shadow: 0 5px 20px -5px rgba(239, 68, 68, 0.4);
          transform: translateY(-1px);
        }

        /* View All Link */
        .td-view-all {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          border-top: 1px solid rgba(100, 116, 139, 0.08);
          color: #7c3aed;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .td-view-all:hover {
          background: rgba(139, 92, 246, 0.04);
          color: #6d28d9;
        }

        .td-view-all svg {
          width: 16px;
          height: 16px;
        }

        /* Recent Activity */
        .td-activity-list {
          display: flex;
          flex-direction: column;
        }

        .td-activity-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid rgba(100, 116, 139, 0.06);
          transition: background 0.2s ease;
        }

        .td-activity-item:last-child {
          border-bottom: none;
        }

        .td-activity-item:hover {
          background: rgba(100, 116, 139, 0.03);
        }

        .td-activity-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(139, 92, 246, 0.06);
          border-radius: 10px;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .td-activity-info {
          flex: 1;
          min-width: 0;
        }

        .td-activity-text {
          font-size: 0.875rem;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .td-activity-time {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.125rem;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .td-main {
            padding: 1.5rem 1rem 3rem;
          }

          .td-hero-title {
            font-size: 1.75rem;
          }

          .td-hero-actions {
            flex-direction: column;
          }

          .td-btn {
            width: 100%;
          }

          .td-stat-card {
            padding: 1rem;
          }

          .td-stat-value {
            font-size: 1.5rem;
          }

          .td-quiz-actions {
            flex-direction: column;
          }

          .td-quiz-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .td-bg-orb,
          .td-hero-greeting-dot {
            animation: none;
          }

          .td-main,
          .td-stat-card,
          .td-quiz-card {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      <div className="td-page">
        {/* Animated Background */}
        <div className="td-bg">
          <div className="td-bg-gradient"></div>
          <div className="td-bg-grid"></div>
          <div className="td-bg-orb td-bg-orb-1"></div>
          <div className="td-bg-orb td-bg-orb-2"></div>
          <div className="td-bg-orb td-bg-orb-3"></div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div
            className="td-modal-overlay"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="td-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="td-modal-icon">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="td-modal-title">Delete Quiz?</h3>
              <p className="td-modal-text">
                This action cannot be undone. All associated results will
                also be removed.
              </p>
              <div className="td-modal-actions">
                <button
                  className="td-modal-btn td-modal-btn-cancel"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="td-modal-btn td-modal-btn-delete"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Delete Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navbar */}
        <Navbar title="EduNexus" links={teacherLinks} />

        {/* Main Content */}
        <main className={`td-main ${mounted ? "td-mounted" : ""}`}>
          {/* Hero Section */}
          <section className="td-hero">
            <div className="td-hero-content">
              <div className="td-hero-text">
                <div className="td-hero-greeting">
                  <span className="td-hero-greeting-dot"></span>
                  <span>{getTimeOfDay()}</span>
                </div>
                <h1 className="td-hero-title">
                  Welcome,{" "}
                  <span className="td-hero-title-highlight">
                    {user?.name || "Teacher"}
                  </span>
                </h1>
                <p className="td-hero-subtitle">
                  Manage your quizzes, review student submissions, and
                  track classroom performance.
                </p>
                <p className="td-hero-date">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="td-hero-actions">
                <button
                  className="td-btn td-btn-primary"
                  onClick={() => navigate("/teacher/create-quiz")}
                >
                  <span>➕</span>
                  <span>Create Quiz</span>
                </button>
                <button
                  className="td-btn td-btn-secondary"
                  onClick={() => navigate("/teacher/groups")}
                >
                  <span>👥</span>
                  <span>Manage Groups</span>
                </button>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="td-stats">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="td-stat-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="td-stat-header">
                  <div className={`td-stat-icon-wrap ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="td-stat-value">{stat.value}</div>
                <div className="td-stat-label">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Message */}
          {message && (
            <div className={`td-message td-message-${messageType}`}>
              {messageType === "success" && (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {messageType === "error" && (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {messageType === "info" && (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Main Layout */}
          <section className="td-layout">
            {/* Left Column - Quizzes */}
            <div>
              <div className="td-panel">
                <div className="td-panel-header">
                  <h2 className="td-panel-title">
                    <span className="td-panel-title-icon">📝</span>
                    Your Quizzes
                  </h2>
                  <span className="td-panel-badge">
                    {quizzes.length} Total
                  </span>
                </div>

                {loading ? (
                  <div className="td-loading">
                    <div className="td-spinner"></div>
                    <span>Loading quizzes...</span>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="td-panel-empty">
                    <svg
                      className="td-panel-empty-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p>No quizzes created yet.</p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      Create your first quiz to get started!
                    </p>
                  </div>
                ) : (
                  <div className="td-panel-body">
                    <div className="td-quiz-list">
                      {quizzes.map((quiz, index) => (
                        <div
                          key={quiz._id}
                          className="td-quiz-card"
                          style={{
                            animationDelay: `${index * 80}ms`,
                          }}
                        >
                          <div className="td-quiz-card-header">
                            <div className="td-quiz-icon">📚</div>
                            <div className="td-quiz-info">
                              <h3 className="td-quiz-title">
                                {quiz.title}
                              </h3>
                              <div className="td-quiz-meta">
                                <span className="td-quiz-meta-item">
                                  <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {quiz.questions?.length || 0}{" "}
                                  Questions
                                </span>
                                <span className="td-quiz-meta-item">
                                  <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {quiz.duration || 30} min
                                </span>
                                <span
                                  className={`td-difficulty ${getDifficultyColor(
                                    quiz.difficulty
                                  )}`}
                                >
                                  {quiz.difficulty || "Medium"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="td-quiz-actions">
                            <button
                              className="td-quiz-btn td-quiz-btn-view"
                              onClick={() =>
                                navigate(
                                  `/teacher/results/${quiz._id}`
                                )
                              }
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              Results
                            </button>
                            <button
                              className="td-quiz-btn td-quiz-btn-edit"
                              onClick={() =>
                                navigate(
                                  `/teacher/update-quiz/${quiz._id}`
                                )
                              }
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              className="td-quiz-btn td-quiz-btn-delete"
                              onClick={() =>
                                setDeleteConfirm(quiz._id)
                              }
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Quick Actions & Activity */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Quick Actions */}
              <div className="td-panel">
                <div className="td-panel-header">
                  <h2 className="td-panel-title">
                    <span className="td-panel-title-icon">⚡</span>
                    Quick Actions
                  </h2>
                </div>
                <div className="td-quick-actions">
                  {quickActions.map((action) => (
                    <button
                      key={action.to}
                      className={`td-quick-btn ${
                        action.primary
                          ? "td-quick-btn-primary"
                          : ""
                      }`}
                      onClick={() => navigate(action.to)}
                    >
                      <span className="td-quick-btn-icon">
                        {action.icon}
                      </span>
                      <span className="td-quick-btn-label">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="td-panel">
                <div className="td-panel-header">
                  <h2 className="td-panel-title">
                    <span className="td-panel-title-icon">🕒</span>
                    Recent Activity
                  </h2>
                </div>
                <div className="td-activity-list">
                  <div className="td-activity-item">
                    <div className="td-activity-icon">📝</div>
                    <div className="td-activity-info">
                      <div className="td-activity-text">
                        New quiz submission received
                      </div>
                      <div className="td-activity-time">
                        2 minutes ago
                      </div>
                    </div>
                  </div>
                  <div className="td-activity-item">
                    <div className="td-activity-icon">👤</div>
                    <div className="td-activity-info">
                      <div className="td-activity-text">
                        Student joined your group
                      </div>
                      <div className="td-activity-time">
                        15 minutes ago
                      </div>
                    </div>
                  </div>
                  <div className="td-activity-item">
                    <div className="td-activity-icon">✅</div>
                    <div className="td-activity-info">
                      <div className="td-activity-text">
                        Quiz grading completed
                      </div>
                      <div className="td-activity-time">
                        1 hour ago
                      </div>
                    </div>
                  </div>
                  <div className="td-activity-item">
                    <div className="td-activity-icon">📚</div>
                    <div className="td-activity-info">
                      <div className="td-activity-text">
                        Material request from student
                      </div>
                      <div className="td-activity-time">
                        3 hours ago
                      </div>
                    </div>
                  </div>
                </div>
                <div className="td-view-all">
                  <span>View All Activity</span>
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default TeacherDashboard;
