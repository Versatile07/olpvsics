import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-wrapper">
            {/* Navbar */}
            <nav className="glass-nav">
                <div className="nav-brand">
                    <div className="brand-logo">LaunchPad</div>
                </div>

                <div className="nav-items">
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <button className="nav-login-btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="tech-hero">
                <div className="hero-grid-bg"></div>
                <div className="hero-glow"></div>

                <div className="hero-content">
                    <span className="badge-new">Version 2.0 Live</span>
                    <h1>
                        The Future of <br />
                        <span className="gradient-text">Digital Learning</span>
                    </h1>
                    <p>
                        Experience a seamless, high-performance educational platform designed for the modern era.
                        Real-time analytics, instant resources, and smart collaboration.
                    </p>

                    <div className="cta-group">
                        <button className="btn-primary" onClick={() => navigate("/login")}>
                            Get Started
                        </button>
                        <button className="btn-secondary" onClick={() => document.getElementById('features').scrollIntoView()}>
                            Explore Features
                        </button>
                    </div>

                    <div className="stats-row">
                        <div className="stat">
                            <span className="stat-val">2k+</span>
                            <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-val">50+</span>
                            <span className="stat-label">Courses</span>
                        </div>
                        <div className="stat">
                            <span className="stat-val">99%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                    </div>
                </div>

                {/* Floating Visual Element */}
                <div className="hero-visual">
                    <div className="floating-card c1">
                        <div className="icon">📊</div>
                        <span>Analytics</span>
                    </div>
                    <div className="floating-card c2">
                        <div className="icon">🚀</div>
                        <span>Fast</span>
                    </div>
                    <div className="floating-card c3">
                        <div className="icon">🔒</div>
                        <span>Secure</span>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="features-section">
                <div className="section-head">
                    <h2>Everything you need.</h2>
                    <p>Powerful tools to supercharge your academic journey.</p>
                </div>

                <div className="bento-grid">
                    <div className="bento-card span-2">
                        <div className="card-icon gradient-1">📚</div>
                        <h3>Smart Library</h3>
                        <p>Instant access to thousands of curated notes and research papers.</p>
                    </div>
                    <div className="bento-card">
                        <div className="card-icon gradient-2">⚡</div>
                        <h3>Real-time Attendance</h3>
                        <p>Track your presence with live data visualization.</p>
                    </div>
                    <div className="bento-card">
                        <div className="card-icon gradient-3">💼</div>
                        <h3>Career Launchpad</h3>
                        <p>Direct placement integrations with top tech firms.</p>
                    </div>
                    <div className="bento-card span-2">
                        <div className="card-icon gradient-4">🔔</div>
                        <h3>Instant Alerts</h3>
                        <p>Never miss a deadline with our push notification system.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="tech-footer">
                <div className="footer-content">
                    <div className="f-col">
                        <h4>LaunchPad</h4>
                        <p>VSICS Kanpur</p>
                    </div>
                    <div className="f-col">
                        <a href="#">Platform</a>
                        <a href="#">Community</a>
                        <a href="#">Support</a>
                    </div>
                    <div className="f-col right">
                        <p>© 2026 VSICS Inc.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
