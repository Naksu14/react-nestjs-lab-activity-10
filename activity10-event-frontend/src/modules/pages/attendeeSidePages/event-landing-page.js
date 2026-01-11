import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import EventImageSlider from "../../../components/EventImageSlider";
import EventsSection from "../../../components/EventsSection";

const EventLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Handle /#events scrolling
  useEffect(() => {
    if (location.hash === "#events") {
      setTimeout(() => {
        const el = document.getElementById("events");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div
      className="min-h-screen flex flex-col pb-12"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Header />

      <div className="pt-[96px] mt-4">
        <EventImageSlider />

        {/* ABOUT */}
        <section className="w-[95%] max-w-6xl mx-auto mt-10 px-4 flex flex-col items-start text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--accent-color)]">
            About
          </h2>

          <p className="text-base md:text-lg text-[var(--text-muted)] mb-6">
            QRserve is your all-in-one platform for discovering, registering, and
            managing event tickets with ease. Enjoy seamless access to amazing
            events, fast check-ins, and a user-friendly experience—whether you're
            an attendee or an organizer.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 mt-2 font-bold hover:underline group"
            style={{ color: "var(--accent-color)" }}
          >
            PROCEED TO LOGIN
            <span
              className="inline-flex items-center ml-4 justify-center w-8 h-8 rounded-full border opacity-10 group-hover:opacity-20 transition-opacity"
              style={{
                backgroundColor: "var(--accent-color)",
                borderColor: "var(--accent-color)",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </section>

        {/* EVENTS */}
        <section id="events" className="w-[95%] max-w-6xl mx-auto mt-10 px-4">
          <EventsSection />
        </section>
      </div>
    </div>
  );
};

export default EventLandingPage;
