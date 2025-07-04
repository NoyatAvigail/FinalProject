import React, { useEffect, useState, useRef } from 'react';
import '../style/Home.css';
import { homeServices } from '../services/homeServices';
import winSound from '../audio/win-sound.mp3';

function Home() {
    const [thanksNotes, setThanksNotes] = useState([]);
    const colors = ['#ffbd59', '#5fa79b', '#e06eb2', '#f15a3c'];

    const [stats, setStats] = useState({
        volunteerCount: 0,
        totalHours: 0,
        hospitalCount: 0,
        departmentCount: 0
    });

    const [displayed, setDisplayed] = useState({
        volunteerCount: 0,
        totalHours: 0,
        hospitalCount: 0,
        departmentCount: 0
    });

    const audioRef = useRef(null);

    const finishedAnimations = useRef(0);
    const totalAnimations = 4;

    useEffect(() => {
        audioRef.current = new Audio(winSound);

        homeServices.getHome(
            (data) => {
                setStats(data);
                setThanksNotes(data.thanksNotes.map(note => ({
                    ...note,
                    color: colors[Math.floor(Math.random() * colors.length)]
                })));

                animateBar('volunteerCount', data.volunteerCount, 1500);
                animateBar('totalHours', data.totalHours, 1500);
                animateBar('hospitalCount', data.hospitalCount, 1500);
                animateBar('departmentCount', data.departmentCount, 1500);
            },
            (err) => console.error("Failed to fetch stats", err)
        );
    }, []);

    const animateBar = (field, target, duration) => {
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(progress * target);
            setDisplayed(prev => ({ ...prev, [field]: currentValue }));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                finishedAnimations.current += 1;
                if (finishedAnimations.current === totalAnimations && audioRef.current) {
                    audioRef.current.play().catch(e => console.warn("Audio play failed:", e));
                }
            }
        }

        requestAnimationFrame(step);
    };

    const maxValues = {
        volunteerCount: Math.max(stats.volunteerCount, 100),
        totalHours: Math.max(stats.totalHours, 200),
        hospitalCount: Math.max(stats.hospitalCount, 100),
        departmentCount: Math.max(stats.departmentCount, 100)
    };

    const renderStat = (label, field) => (
        <div className="stat-item">
            <div className="stat-header">
                <p className="stat-label">{label}</p>
                <h3 className="stat-number">{displayed[field].toLocaleString()}</h3>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${(displayed[field] / maxValues[field]) * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <div className="home-container">
            <h1>Welcome to our Volunteers Platform</h1>
            <p className="slogan">MAKING A DIFFERENCE TOGETHER</p>
            {renderStat("Active Volunteers:", "volunteerCount")}
            {renderStat("Total Volunteer Hours:", "totalHours")}
            {renderStat("Volunteering in hospitals in Israel:", "hospitalCount")}
            {renderStat("Volunteering in several departments:", "departmentCount")}
            <h2><br /><br /></h2>
            <h2>A little about us</h2>
            <p>Our website is a unique and inclusive space where giving and compassion meet the human heart.</p>
            <p>Here, motivated volunteers from all backgrounds come together, driven by a genuine desire to contribute...</p>
            <h2>How does it work?</h2>
            <p>Every volunteer registers by filling in their personal details along with preferences...</p>
            <h2 className="highlight">Our platform is more than a system — </h2>
            <h2 className="highlight">It’s a community of giving, partnership, and hope.</h2>
            <p>Every volunteer is a hero here, and every patient is cared for with compassionate hands.</p>
            <p>Join us and be part of a change that starts with one small act of kindness —</p>
            <h2><strong>MAKING A DIFFERENCE TOGETHER.</strong></h2>
            <h2 className="thank-you-header">What our contact people say:</h2>
            <div className="notes-grid">
                {thanksNotes.map(note => (
                    <div className="note-card" key={note.id} style={{ backgroundColor: note.color }}>
                        <div className="note-message">{note.message}</div>
                        <div className="note-author">— {note.fromName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;