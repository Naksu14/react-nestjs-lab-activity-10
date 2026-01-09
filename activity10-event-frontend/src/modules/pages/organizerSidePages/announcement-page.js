import React from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";

const Announcements = () => {
  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <NavBar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          
        </main>
      </div>
    </div>
  );
};

export default Announcements;
