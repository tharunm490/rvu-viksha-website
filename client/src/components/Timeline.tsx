import React from "react";
import "./Timeline.css";
import { useLocation } from "wouter";

const Timeline: React.FC = () => {
  const [_, navigate] = useLocation();

  // Redirects to team page with a specific year filter
  const handleRedirect = (year: number) => {
    navigate(`/team?year=${year}`);
  };

  return (
    <section className="core-team-section transition-colors duration-300" id="core-team">
      <h2 className="rainbow-heading text-foreground">The Core Team</h2>
      <p className="subtitle text-foreground opacity-70">
        Every club is powered by its people - these are ours!
      </p>
      <div className="timeline">
        <span className="end-dot left" aria-hidden />

        <div className="timeline-point top">
          <div className="connector up">
            <div className="circle" />
          </div>
          <span className="year rainbow-text">2022</span>
        </div>

        <div className="timeline-point bottom">
          <div className="connector down">
            <div className="circle" />
          </div>
          <span className="year rainbow-text">2023</span>
        </div>

        <div className="timeline-point top">
          <div className="connector up">
            <div className="circle" />
          </div>
          <span
            className="year rainbow-text clickable"
            onClick={() => handleRedirect(2024)}
          >
            2024
          </span>
        </div>

        <div className="timeline-point bottom">
          <div className="connector down">
            <div className="circle" />
          </div>
          <span
            className="year rainbow-text clickable"
            onClick={() => handleRedirect(2025)}
          >
            2025
          </span>
        </div>

        <span className="end-dot right" aria-hidden />
      </div>
    </section>
  );
};

export default Timeline;