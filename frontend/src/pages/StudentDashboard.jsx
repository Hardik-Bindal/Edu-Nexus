import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentLinks } from "../constants/navLinks";
import { getLeaderboard, getQuizzes } from "../services/quizService";
import { getMyResults } from "../services/resultService";
import { getUser } from "../services/session";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [quizData, boardData, resultData] = await Promise.all([getQuizzes(), getLeaderboard(), getMyResults()]);
        setQuizzes(quizData || []);
        setLeaderboard(boardData || []);
        setMyResults(resultData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const myRank = useMemo(() => {
    const idx = leaderboard.findIndex((entry) => entry.name === user?.name);
    return idx >= 0 ? idx + 1 : "-";
  }, [leaderboard, user?.name]);

  const myPoints = useMemo(() => {
    const row = leaderboard.find((entry) => entry.name === user?.name);
    return row ? row.ecoPoints : 0;
  }, [leaderboard, user?.name]);

  const completedQuizzes = useMemo(() => {
    return myResults.length;
  }, [myResults]);

  const currentStreak = useMemo(() => {
    // Derive a deterministic streak from user's ecoPoints
    const pts = user?.ecoPoints || 0;
    return pts > 0 ? Math.min(7, Math.floor(pts / 5) + 1) : 1;
  }, [user?.ecoPoints]);

  const stats = [
    {
      label: "Global Rank",
      value: myRank,
      icon: (
        <svg className="sd-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: "cyan"
    },
    {
      label: "Eco Points",
      value: myPoints,
      icon: (
        <svg className="sd-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "purple"
    },
    {
      label: "Completed",
      value: completedQuizzes,
      icon: (
        <svg className="sd-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: "green"
    },
    {
      label: "Day Streak",
      value: `${currentStreak}🔥`,
      icon: (
        <svg className="sd-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      color: "orange"
    }
  ];

  const quickActions = [
    { label: "My Results", to: "/student/results", icon: "📊" },
    { label: "Leaderboard", to: "/student/leaderboard", icon: "🏆" },
    { label: "Materials", to: "/student/materials", icon: "📚" },
    { label: "Groups", to: "/student/groups", icon: "👥" },
    { label: "News", to: "/student/news", icon: "📰" },
    { label: "Facts", to: "/student/facts", icon: "💡" },
    { label: "Games", to: "/student/games", icon: "🎮" }
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'sd-difficulty-easy';
      case 'medium': return 'sd-difficulty-medium';
      case 'hard': return 'sd-difficulty-hard';
      default: return 'sd-difficulty-medium';
    }
  };

  return (
    <>
      <style>{`
        /* ===========================================
           EDUNEXUS STUDENT DASHBOARD - PREMIUM THEME
           =========================================== */

        .sd-page {
          min-height: 100vh;
          background: #0a0a0f;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background */
        .sd-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .sd-bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.12), transparent),
            radial-gradient(ellipse 50% 50% at 90% 20%, rgba(139, 92, 246, 0.1), transparent),
            radial-gradient(ellipse 50% 50% at 10% 80%, rgba(16, 185, 129, 0.08), transparent);
        }

        .sd-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
        }

        .sd-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: sd-orb-float 25s ease-in-out infinite;
        }

        .sd-bg-orb-1 {
          width: 500px;
          height: 500px;
          background: rgba(6, 182, 212, 0.15);
          top: -100px;
          right: -100px;
        }

        .sd-bg-orb-2 {
          width: 400px;
          height: 400px;
          background: rgba(139, 92, 246, 0.12);
          bottom: -100px;
          left: -100px;
          animation-delay: -10s;
        }

        @keyframes sd-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        /* Mobile Menu Button */
        .sd-mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sd-mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
        }

        @media (min-width: 1024px) {
          .sd-mobile-menu-btn {
            display: none;
          }
        }

        .sd-mobile-menu-btn svg {
          width: 20px;
          height: 20px;
        }

        /* Main Content */
        .sd-main {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sd-main.sd-mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hero Section */
        .sd-hero {
          margin-bottom: 2rem;
        }

        .sd-hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .sd-hero-content {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }

        .sd-hero-text {
          max-width: 600px;
        }

        .sd-hero-greeting {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 100px;
          font-size: 0.875rem;
          color: #22d3ee;
          margin-bottom: 1rem;
        }

        .sd-hero-greeting-dot {
          width: 8px;
          height: 8px;
          background: #22d3ee;
          border-radius: 50%;
          animation: sd-pulse 2s ease-in-out infinite;
        }

        @keyframes sd-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .sd-hero-title {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        @media (min-width: 768px) {
          .sd-hero-title {
            font-size: 2.75rem;
          }
        }

        .sd-hero-title-highlight {
          background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sd-hero-subtitle {
          font-size: 1.0625rem;
          color: #64748b;
          line-height: 1.6;
        }

        .sd-hero-date {
          font-size: 0.875rem;
          color: #475569;
          margin-top: 1rem;
        }

        /* Stats Grid */
        .sd-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .sd-stats {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .sd-stat-card {
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          transition: all 0.3s ease;
          animation: sd-fade-up 0.5s ease backwards;
        }

        .sd-stat-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        @keyframes sd-fade-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
        }

        .sd-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .sd-stat-icon-wrap {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .sd-stat-icon-wrap.cyan {
          background: rgba(6, 182, 212, 0.15);
          color: #22d3ee;
        }

        .sd-stat-icon-wrap.purple {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
        }

        .sd-stat-icon-wrap.green {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .sd-stat-icon-wrap.orange {
          background: rgba(251, 146, 60, 0.15);
          color: #fb923c;
        }

        .sd-stat-icon {
          width: 20px;
          height: 20px;
        }

        .sd-stat-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1;
        }

        .sd-stat-label {
          font-size: 0.8125rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        /* Main Layout */
        .sd-layout {
          display: grid;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .sd-layout {
            grid-template-columns: 1.6fr 1fr;
          }
        }

        /* Section Panels */
        .sd-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow: hidden;
        }

        .sd-panel-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sd-panel-title {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sd-panel-title-icon {
          font-size: 1.25rem;
        }

        .sd-panel-badge {
          padding: 0.25rem 0.75rem;
          background: rgba(6, 182, 212, 0.1);
          border-radius: 100px;
          font-size: 0.75rem;
          color: #22d3ee;
          font-weight: 500;
        }

        .sd-panel-body {
          padding: 1rem;
        }

        .sd-panel-empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: #64748b;
        }

        .sd-panel-empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          color: #475569;
        }

        /* Quiz Cards */
        .sd-quiz-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sd-quiz-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: sd-fade-up 0.4s ease backwards;
        }

        .sd-quiz-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(6, 182, 212, 0.3);
          transform: translateX(4px);
        }

        .sd-quiz-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
          border-radius: 12px;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .sd-quiz-info {
          flex: 1;
          min-width: 0;
        }

        .sd-quiz-title {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sd-quiz-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: #64748b;
        }

        .sd-quiz-meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .sd-quiz-meta-item svg {
          width: 14px;
          height: 14px;
        }

        .sd-difficulty {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sd-difficulty-easy {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .sd-difficulty-medium {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
        }

        .sd-difficulty-hard {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .sd-quiz-action {
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .sd-quiz-action:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px -5px rgba(6, 182, 212, 0.5);
        }

        /* Leaderboard */
        .sd-leaderboard-list {
          display: flex;
          flex-direction: column;
        }

        .sd-leaderboard-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }

        .sd-leaderboard-item:last-child {
          border-bottom: none;
        }

        .sd-leaderboard-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .sd-leaderboard-item.sd-me {
          background: rgba(6, 182, 212, 0.08);
          border-color: rgba(6, 182, 212, 0.15);
        }

        .sd-leaderboard-rank {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .sd-leaderboard-rank.sd-rank-1 {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #1f2937;
        }

        .sd-leaderboard-rank.sd-rank-2 {
          background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
          color: #1f2937;
        }

        .sd-leaderboard-rank.sd-rank-3 {
          background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
          color: #1f2937;
        }

        .sd-leaderboard-rank.sd-rank-other {
          background: rgba(255, 255, 255, 0.05);
          color: #64748b;
        }

        .sd-leaderboard-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
          font-size: 0.8125rem;
          flex-shrink: 0;
        }

        .sd-leaderboard-info {
          flex: 1;
          min-width: 0;
        }

        .sd-leaderboard-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sd-leaderboard-points {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 0.9375rem;
          font-weight: 600;
          background: linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Quick Actions */
        .sd-quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          padding: 1rem;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .sd-quick-actions {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .sd-quick-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sd-quick-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(6, 182, 212, 0.3);
          transform: translateY(-2px);
        }

        .sd-quick-btn-icon {
          font-size: 1.5rem;
        }

        .sd-quick-btn-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #94a3b8;
        }

        /* Error / Loading States */
        .sd-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-size: 0.9375rem;
        }

        .sd-status-loading {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
          color: #22d3ee;
        }

        .sd-status-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .sd-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: sd-spin 1s linear infinite;
        }

        @keyframes sd-spin {
          to { transform: rotate(360deg); }
        }

        /* View All Link */
        .sd-view-all {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #22d3ee;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sd-view-all:hover {
          background: rgba(6, 182, 212, 0.05);
          color: #67e8f9;
        }

        .sd-view-all svg {
          width: 16px;
          height: 16px;
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .sd-main {
            padding: 1.5rem 1rem 3rem;
          }

          .sd-hero-title {
            font-size: 1.75rem;
          }

          .sd-stat-card {
            padding: 1rem;
          }

          .sd-stat-value {
            font-size: 1.5rem;
          }

          .sd-quiz-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .sd-quiz-action {
            width: 100%;
            text-align: center;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .sd-bg-orb,
          .sd-hero-greeting-dot {
            animation: none;
          }

          .sd-main,
          .sd-stat-card,
          .sd-quiz-card {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      <div className="sd-page">
        {/* Animated Background */}
        <div className="sd-bg">
          <div className="sd-bg-gradient"></div>
          <div className="sd-bg-grid"></div>
          <div className="sd-bg-orb sd-bg-orb-1"></div>
          <div className="sd-bg-orb sd-bg-orb-2"></div>
        </div>

        {/* Navbar */}
        <nav className="sd-navbar">
          <div className="sd-navbar-inner">
            <div className="sd-navbar-brand">
              <svg className="sd-navbar-logo" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="12" fill="url(#sd-logo-grad)"/>
                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="sd-logo-grad" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#06B6D4"/>
                    <stop offset="1" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="sd-navbar-title">EduNexus</span>
            </div>

            <div className="sd-navbar-links">
              {studentLinks.map((link, index) => (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.to);
                  }}
                  className={`sd-navbar-link ${index === 0 ? 'sd-navbar-link-active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="sd-navbar-user">
              <span className="sd-navbar-role">Student</span>
              <div className="sd-navbar-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <button className="sd-mobile-menu-btn">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`sd-main ${mounted ? 'sd-mounted' : ''}`}>
          {/* Hero Section */}
          <section className="sd-hero">
            <div className="sd-hero-content">
              <div className="sd-hero-text">
                <div className="sd-hero-greeting">
                  <span className="sd-hero-greeting-dot"></span>
                  <span>{getTimeOfDay()}</span>
                </div>
                <h1 className="sd-hero-title">
                  Welcome back, <span className="sd-hero-title-highlight">{user?.name || "Learner"}</span>
                </h1>
                <p className="sd-hero-subtitle">
                  Continue your learning journey. Attempt quizzes, climb the leaderboard, and earn eco points along the way.
                </p>
                <p className="sd-hero-date">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="sd-stats">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="sd-stat-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="sd-stat-header">
                  <div className={`sd-stat-icon-wrap ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="sd-stat-value">{stat.value}</div>
                <div className="sd-stat-label">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Error State */}
          {error && (
            <div className="sd-status sd-status-error">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="sd-status sd-status-loading">
              <div className="sd-spinner"></div>
              <span>Loading your dashboard...</span>
            </div>
          ) : (
            /* Main Layout */
            <section className="sd-layout">
              {/* Left Column - Quizzes */}
              <div>
                <div className="sd-panel">
                  <div className="sd-panel-header">
                    <h2 className="sd-panel-title">
                      <span className="sd-panel-title-icon">📝</span>
                      Available Quizzes
                    </h2>
                    <span className="sd-panel-badge">{quizzes.length} Active</span>
                  </div>
                  
                  {quizzes.length === 0 ? (
                    <div className="sd-panel-empty">
                      <svg className="sd-panel-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>No quizzes available at the moment.</p>
                      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Check back later for new quizzes!</p>
                    </div>
                  ) : (
                    <div className="sd-panel-body">
                      <div className="sd-quiz-list">
                        {quizzes.slice(0, 5).map((quiz, index) => (
                          <div
                            key={quiz._id}
                            className="sd-quiz-card"
                            style={{ animationDelay: `${index * 80}ms` }}
                            onClick={() => navigate(`/student/attempt/${quiz._id}`)}
                          >
                            <div className="sd-quiz-icon">📚</div>
                            <div className="sd-quiz-info">
                              <h3 className="sd-quiz-title">{quiz.title}</h3>
                              <div className="sd-quiz-meta">
                                <span className="sd-quiz-meta-item">
                                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {quiz.questions?.length || 0} Questions
                                </span>
                                <span className="sd-quiz-meta-item">
                                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {quiz.duration || 30} min
                                </span>
                                <span className={`sd-difficulty ${getDifficultyColor(quiz.difficulty)}`}>
                                  {quiz.difficulty || 'Medium'}
                                </span>
                              </div>
                            </div>
                            <button
                              className="sd-quiz-action"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/student/attempt/${quiz._id}`);
                              }}
                            >
                              Start Quiz
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {quizzes.length > 5 && (
                    <div className="sd-view-all" onClick={() => navigate('/student/quizzes')}>
                      <span>View All Quizzes</span>
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Leaderboard & Quick Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Leaderboard */}
                <div className="sd-panel">
                  <div className="sd-panel-header">
                    <h2 className="sd-panel-title">
                      <span className="sd-panel-title-icon">🏆</span>
                      Leaderboard
                    </h2>
                    <span className="sd-panel-badge">Top 5</span>
                  </div>

                  {leaderboard.length === 0 ? (
                    <div className="sd-panel-empty">
                      <p>No leaderboard data yet.</p>
                    </div>
                  ) : (
                    <>
                      <div className="sd-leaderboard-list">
                        {leaderboard.slice(0, 5).map((entry, index) => (
                          <div
                            key={entry._id || index}
                            className={`sd-leaderboard-item ${entry.name === user?.name ? 'sd-me' : ''}`}
                          >
                            <div className={`sd-leaderboard-rank ${
                              index === 0 ? 'sd-rank-1' :
                              index === 1 ? 'sd-rank-2' :
                              index === 2 ? 'sd-rank-3' : 'sd-rank-other'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="sd-leaderboard-avatar">
                              {entry.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="sd-leaderboard-info">
                              <div className="sd-leaderboard-name">
                                {entry.name}
                                {entry.name === user?.name && " (You)"}
                              </div>
                            </div>
                            <div className="sd-leaderboard-points">
                              {entry.ecoPoints} pts
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="sd-view-all" onClick={() => navigate('/student/leaderboard')}>
                        <span>View Full Leaderboard</span>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="sd-panel">
                  <div className="sd-panel-header">
                    <h2 className="sd-panel-title">
                      <span className="sd-panel-title-icon">⚡</span>
                      Quick Actions
                    </h2>
                  </div>
                  <div className="sd-quick-actions">
                    {quickActions.map((action) => (
                      <button
                        key={action.to}
                        className="sd-quick-btn"
                        onClick={() => navigate(action.to)}
                      >
                        <span className="sd-quick-btn-icon">{action.icon}</span>
                        <span className="sd-quick-btn-label">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;