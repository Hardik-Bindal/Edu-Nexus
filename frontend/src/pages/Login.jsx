import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/authService";
import { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login({ email, password });
      navigate(data.user.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await googleLogin();
      navigate(data.user.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: (
        <svg className="login-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Learning",
      description: "Smart quizzes that adapt to your pace"
    },
    {
      icon: (
        <svg className="login-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Real-time Progress",
      description: "Track growth with detailed analytics"
    },
    {
      icon: (
        <svg className="login-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Collaborative Groups",
      description: "Learn together with study groups"
    },
    {
      icon: (
        <svg className="login-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: "Gamified Learning",
      description: "Earn points and climb leaderboards"
    }
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${15 + Math.random() * 20}s`
  }));

  return (
    <>
      <div className="login-page">
        {/* Animated Background */}
        <div className="login-bg">
          <div className="login-bg-gradient"></div>
          <div className="login-bg-grid"></div>
          <div className="login-bg-glow login-bg-glow-1"></div>
          <div className="login-bg-glow login-bg-glow-2"></div>
          <div className="login-bg-glow login-bg-glow-3"></div>
          
          {/* Floating Particles */}
          <div className="login-particles">
            {particles.map((particle) => (
              <div 
                key={particle.id} 
                className="login-particle"
                style={{
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration
                }}
              ></div>
            ))}
          </div>
        </div>

        <main className={`login-main ${mounted ? 'login-mounted' : ''}`}>
          {/* Left Panel - Branding & Features */}
          <section className="login-brand">
            <div className="login-brand-content">
              {/* Logo */}
              <div className="login-logo">
                <div className="login-logo-icon">
                  <svg viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="12" fill="url(#login-logo-gradient)"/>
                    <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="login-logo-gradient" x1="0" y1="0" x2="40" y2="40">
                        <stop stopColor="#06B6D4"/>
                        <stop offset="1" stopColor="#8B5CF6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="login-logo-text">EduNexus</span>
              </div>

              {/* Hero Content */}
              <div className="login-hero">
                <div className="login-badge">
                  <span className="login-badge-dot"></span>
                  <span>Next-Gen Learning Platform</span>
                </div>
                
                <h1 className="login-title">
                  Transform Your
                  <span className="login-title-gradient"> Learning Journey</span>
                </h1>
                
                <p className="login-subtitle">
                  Experience adaptive AI quizzes, real-time collaboration, and gamified 
                  progress tracking — all in one powerful platform.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="login-features">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="login-feature"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="login-feature-icon">
                      {feature.icon}
                    </div>
                    <div className="login-feature-content">
                      <h3 className="login-feature-title">{feature.title}</h3>
                      <p className="login-feature-desc">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="login-stats">
                <div className="login-stat">
                  <span className="login-stat-value">10K+</span>
                  <span className="login-stat-label">Active Users</span>
                </div>
                <div className="login-stat-divider"></div>
                <div className="login-stat">
                  <span className="login-stat-value">50K+</span>
                  <span className="login-stat-label">Quizzes Taken</span>
                </div>
                <div className="login-stat-divider"></div>
                <div className="login-stat">
                  <span className="login-stat-value">98%</span>
                  <span className="login-stat-label">Satisfaction</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel - Login Form */}
          <section className="login-form-section">
            <div className="login-form-container">
              {/* Mobile Logo */}
              <div className="login-mobile-logo">EduNexus</div>

              {/* Form Header */}
              <div className="login-form-header">
                <h2 className="login-form-title">Welcome back</h2>
                <p className="login-form-subtitle">Sign in to continue your learning journey</p>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="login-google-btn"
              >
                <svg viewBox="0 0 24 24" className="login-google-icon">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="login-divider">
                <span>or continue with email</span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="login-form">
                {/* Email Field */}
                <div className="login-field">
                  <label className="login-label" htmlFor="email">
                    Email Address
                  </label>
                  <div className="login-input-wrapper">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="login-input"
                      placeholder="you@example.com"
                    />
                    <div className="login-input-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="login-field">
                  <label className="login-label" htmlFor="password">
                    Password
                  </label>
                  <div className="login-input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="login-input login-input-password"
                      placeholder="Enter your password"
                    />
                    <div className="login-input-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-password-toggle"
                    >
                      {showPassword ? (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="login-options">
                  <label className="login-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="login-checkbox-input"
                    />
                    <span className="login-checkbox-mark"></span>
                    <span className="login-checkbox-text">Remember me</span>
                  </label>
                  <a href="#" className="login-forgot" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="login-error">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="login-submit"
                >
                  <span className="login-submit-content">
                    {loading ? (
                      <>
                        <svg className="login-spinner" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Sign Up Link */}
              <p className="login-signup">
                Don't have an account?{" "}
                <Link to="/register" className="login-signup-link">
                  Create free account
                </Link>
              </p>

              {/* Terms */}
              <p className="login-terms">
                By signing in, you agree to our{" "}
                <a href="#" className="login-terms-link">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="login-terms-link">Privacy Policy</a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Login;