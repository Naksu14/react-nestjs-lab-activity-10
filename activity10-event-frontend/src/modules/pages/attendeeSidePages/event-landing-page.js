
import React from "react";
import Header from "../../../components/Header";
import EventImageSlider from "../../../components/EventImageSlider";
import EventsSection from "../../../components/EventsSection";


const EventLandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[var(--text-primary)] pb-12">
      <Header />
      <div className="pt-[96px] mt-4">
        <EventImageSlider />
        <section className="w-[95%] max-w-6xl mx-auto mt-10 px-4 flex flex-col items-start text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--accent-color)] text-left">About</h2>
          <p className="text-base md:text-lg text-[var(--text-muted)] mb-6 text-left">
            QRserve is your all-in-one platform for discovering, registering, and managing event tickets with ease. Enjoy seamless access to amazing events, fast check-ins, and a user-friendly experience—whether you're an attendee or an organizer.
          </p>
          <a href="#" className="flex items-center gap-2 text-[var(--accent-color)] mt-2 font-bold hover:underline group text-left">
            PROCEED TO LOGIN 
            <span className="inline-flex items-center ml-4 justify-center w-8 h-8 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)] group-hover:bg-[var(--accent-color)]/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </section>
        <EventsSection />
      </div>
    </div>
  );
};

export default EventLandingPage;
