import React, { useState, useEffect } from 'react';
import '../styles/ComingSoon.css'; // Import the stylesheet
import logo from '../assets/images.png'; // Make sure the path to your logo is correct

const ComingSoon = () => {
    const calculateTimeLeft = () => {
        const countDownDate = new Date("Oct 15, 2025 00:00:00").getTime();
        const now = new Date().getTime();
        const distance = countDownDate - now;

        let timeLeft = {};

        if (distance > 0) {
            timeLeft = {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear the timer when the component unmounts or timeLeft changes
        return () => clearTimeout(timer);
    });

    // Helper function to add a leading zero
    const formatTime = (time) => (time < 10 ? `0${time}` : time);
    
    const timerComponents = Object.keys(timeLeft).length ? (
        <div id="timer">
            <div className="time-unit">
                <span className="number">{formatTime(timeLeft.days)}</span>
                <span className="label">Days</span>
            </div>
            <div className="time-unit">
                <span className="number">{formatTime(timeLeft.hours)}</span>
                <span className="label">Hours</span>
            </div>
            <div className="time-unit">
                <span className="number">{formatTime(timeLeft.minutes)}</span>
                <span className="label">Minutes</span>
            </div>
            <div className="time-unit">
                <span className="number">{formatTime(timeLeft.seconds)}</span>
                <span className="label">Seconds</span>
            </div>
        </div>
    ) : (
        <h2>We Are Live!</h2>
    );

    return (
        <div className="coming-soon-container">
            <main className="container">
                <img src={logo} alt="Crescent Blood Donors Logo" className="logo" />

                <h1>Our Website is Launching Soon In Sha Allah!</h1>
                <p>We are working hard to bring you a new online experience. Stay tuned!</p>

                {timerComponents}

                <footer className="slogan">
                    <span className="red">SHARE BLOOD!</span> <span className="green">SAVE LIFE!</span>
                </footer>
            </main>
        </div>
    );
};

export default ComingSoon;