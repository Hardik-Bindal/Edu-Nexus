import { Link, useNavigate } from "react-router-dom";
import { register, googleLogin } from "../services/authService";
import { useState, useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await register(form);
      setMessage("Account created successfully! Redirecting to login...");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await googleLogin();
      navigate(data.user.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "🎯",
      title: "Adaptive Quizzes",
      description: "AI-powered assessments that adapt to learning pace"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Detailed analytics and performance insights"
    },
    {
      icon: "👥",
      title: "Collaborative Learning",
      description: "Study groups and shared resources"
    },
    {
      icon: "🏆",
      title: "Gamification",
      description: "Earn points and climb the leaderboard"
    }
  ];

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${15 + Math.random() * 20}s`
  }));

  const passwordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { level: 0, text: "", color: "" };
    if (pwd.length < 6) return { level: 1, text: "Weak", color: "#ef4444" };
    if (pwd.length < 8) return { level: 2, text: "Fair", color: "#f59e0b" };
    if (pwd.length < 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { level: 3, text: "Good", color: "#22d3ee" };
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return { level: 4, text: "Strong", color: "#10b981" };
    return { level: 2, text: "Fair", color: "#f59e0b" };
  };

  const strength = passwordStrength();

  return (
    <>
      <div className="reg-page">
        {/* Animated Background */}
        <div className="reg-bg">
          <div className="reg-bg-gradient"></div>
          <div className="reg-bg-grid"></div>
          <div className="reg-bg-glow reg-bg-glow-1"></div>
          <div className="reg-bg-glow reg-bg-glow-2"></div>
          <div className="reg-bg-glow reg-bg-glow-3"></div>
          
          {/* Floating Particles */}
          <div className="reg-particles">
            {particles.map((particle) => (
              <div 
                key={particle.id} 
                className="reg-particle"
                style={{
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration
                }}
              ></div>
            ))}
          </div>
        </div>

        <main className={`reg-main ${mounted ? 'reg-mounted' : ''}`}>
          {/* Left Panel - Branding & Features */}
          <section className="reg-brand">
            <div className="reg-brand-content">
              {/* Logo */}
              <div className="reg-logo">
                <div className="reg-logo-icon">
                  <svg viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="12" fill="url(#reg-logo-gradient)"/>
                    <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="reg-logo-gradient" x1="0" y1="0" x2="40" y2="40">
                        <stop stopColor="#10B981"/>
                        <stop offset="1" stopColor="#06B6D4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="reg-logo-text">EduNexus</span>
              </div>

              {/* Hero Content */}
              <div className="reg-hero">
                <div className="reg-badge">
                  <span className="reg-badge-dot"></span>
                  <span>Join Our Learning Community</span>
                </div>
                
                <h1 className="reg-title">
                  Start Your
                  <span className="reg-title-gradient"> Learning Journey</span>
                </h1>
                
                <p className="reg-subtitle">
                  Create your account and join thousands of learners and educators using 
                  AI-powered quizzes, collaborative tools, and gamified progress tracking.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="reg-features">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="reg-feature"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="reg-feature-icon">
                      {feature.icon}
                    </div>
                    <div className="reg-feature-content">
                      <h3 className="reg-feature-title">{feature.title}</h3>
                      <p className="reg-feature-desc">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Panel - Register Form */}
          <section className="reg-form-section">
            <div className="reg-form-container">
              {/* Mobile Logo */}
              <div className="reg-mobile-logo">EduNexus</div>

              {/* Form Header */}
              <div className="reg-form-header">
          <h2 className="reg-form-title">Create an Account</h2>
          <p className="reg-form-subtitle">Join EduNexus and start your journey</p>
        </div>

        <div className="reg-social" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            className="reg-social-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
              padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', 
              color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>

        <div className="login-divider" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#475569', fontSize: '0.8125rem' }}>
          <span style={{ display: 'flex', flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '1px' }}></span>
          <span>or create with email</span>
          <span style={{ display: 'flex', flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '1px' }}></span>
        </div>
              {/* Role Selector */}
              <div className="reg-role-selector">
                <button
                  type="button"
                  className={`reg-role-btn ${form.role === 'student' ? 'reg-role-active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, role: 'student' }))}
                >
                  <div className="reg-role-check">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="reg-role-icon">🎓</div>
                  <div className="reg-role-title">Student</div>
                  <div className="reg-role-desc">Learn & grow</div>
                </button>
                <button
                  type="button"
                  className={`reg-role-btn reg-role-teacher ${form.role === 'teacher' ? 'reg-role-active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, role: 'teacher' }))}
                >
                  <div className="reg-role-check">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="reg-role-icon">👨‍🏫</div>
                  <div className="reg-role-title">Teacher</div>
                  <div className="reg-role-desc">Create & manage</div>
                </button>
              </div>

              {/* Register Form */}
              <form onSubmit={onSubmit} className="reg-form">
                {/* Name Field */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="name">
                    Full Name
                  </label>
                  <div className="reg-input-wrapper">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={onChange}
                      required
                      className="reg-input"
                      placeholder="Enter your full name"
                    />
                    <div className="reg-input-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="email">
                    Email Address
                  </label>
                  <div className="reg-input-wrapper">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      required
                      className="reg-input"
                      placeholder="you@example.com"
                    />
                    <div className="reg-input-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="password">
                    Password
                  </label>
                  <div className="reg-input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={onChange}
                      required
                      className="reg-input reg-input-password"
                      placeholder="Create a strong password"
                    />
                    <div className="reg-input-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="reg-password-toggle"
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
                  
                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="reg-password-strength">
                      <div className="reg-strength-bars">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`reg-strength-bar ${strength.level >= level ? 'reg-strength-active' : ''}`}
                            style={{ '--strength-color': strength.color }}
                          ></div>
                        ))}
                      </div>
                      <span className="reg-strength-text" style={{ color: strength.color }}>
                        {strength.text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message */}
                {message && (
                  <div className={`reg-message reg-message-${messageType}`}>
                    {messageType === "success" ? (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span>{message}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="reg-submit"
                >
                  <span className="reg-submit-content">
                    {loading ? (
                      <>
                        <svg className="reg-spinner" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Sign In Link */}
              <p className="reg-signin">
                Already have an account?{" "}
                <Link to="/login" className="reg-signin-link">
                  Sign in
                </Link>
              </p>

              {/* Terms */}
              <p className="reg-terms">
                By creating an account, you agree to our{" "}
                <a href="#" className="reg-terms-link">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="reg-terms-link">Privacy Policy</a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Register;
