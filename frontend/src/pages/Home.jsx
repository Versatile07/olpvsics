import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">VSICS Portal</div>
                <div className="nav-links">
                    <button className="login-btn" onClick={() => navigate("/login")}>
                        Login to Portal
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <h1>Dr. Virendra Swarup Institute of Computer Studies</h1>
                    <p>Empowering Students with Digital Learning</p>
                    <div className="hero-buttons">
                        <button className="cta-btn primary" onClick={() => navigate("/login")}>
                            Get Started
                        </button>
                        <button className="cta-btn secondary" onClick={() => document.getElementById("features").scrollIntoView()}>
                            Learn More
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="features">
                <h2>Our Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="icon">📚</div>
                        <h3>Study Materials</h3>
                        <p>Access notes, assignments, and previous year papers anytime.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">✅</div>
                        <h3>Smart Attendance</h3>
                        <p>Track your daily attendance and academic progress seamlessly.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">💼</div>
                        <h3>Placements</h3>
                        <p>Stay updated with the latest job openings and internships.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">📢</div>
                        <h3>Digital Notices</h3>
                        <p>Get instant updates on college announcements and events.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2026 VSICS Kanpur. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
