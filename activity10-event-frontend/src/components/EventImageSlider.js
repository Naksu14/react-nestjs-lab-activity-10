import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  require("../assets/images/sample-event-1.jpg"),
  require("../assets/images/sample-event-2.jpg"),
];

const EventImageSlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[385px] md:h-[700px] overflow-hidden mt-8">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`event-slide-${idx}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          draggable={false}
        />
      ))}
      <div
        className="absolute inset-0 z-20"
        style={{ backgroundColor: "var(--hero-overlay)" }}
      />
      <div
        className="absolute inset-0 z-30 flex flex-col items-start justify-center px-8 md:px-16"
        style={{ marginLeft: "10%", color: "var(--hero-title)" }}
      >
        <h1 className="text-3xl md:text-5xl mb-2 text-left">
          <span className="font-bold" style={{ color: '#7c3aed' }}>Be a Guest</span> <span className="font-normal">on Amazing Events</span>
        </h1>
        <p
          className="text-base md:text-lg mb-6 max-w-xl text-left"
          style={{
            color: "var(--hero-subtitle)",
            textShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Register and reserve tickets for your favorite events. Discover, join, and
          never miss out on the best happenings around you. Simple, fast, and free for
          everyone!
        </p>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 rounded text-lg font-semibold shadow transition-colors"
            style={{
              backgroundColor: "var(--accent-color)",
              color: "#fff",
              border: "1px solid transparent",
            }}
            onClick={() => navigate("/signup")}
          >
            Get started
          </button>
          <button
            className="px-6 py-2 rounded text-lg font-semibold shadow transition-colors border hover:opacity-90"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0 w-full h-24 md:h-40 z-40"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
          fill="var(--hero-wave)"
        />
      </svg>
    </div>
  );
};

export default EventImageSlider;
