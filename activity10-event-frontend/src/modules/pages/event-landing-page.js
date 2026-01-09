
import React from "react";
import Header from "../../components/Header";


const EventLandingPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]"
    >
      <Header />
      <div className="flex-1 flex justify-center items-center py-8 px-4 font-medium">
        attendee landing page
      </div>
    </div>
  );
};

export default EventLandingPage;
