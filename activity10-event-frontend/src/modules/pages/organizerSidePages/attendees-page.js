import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import AttendeesList from "../../../components/attendees/AttendeesList";
import { useAttendeesByOrganizer } from "../../../hooks/organizehooks/useAttendees";
import { getCurrentUser } from "../../../services/authService";

const Attendees = () => {
  const [organizerId, setOrganizerId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted && user && (user.id || user._id)) {
          setOrganizerId(user.id || user._id);
        }
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const {
    data: attendees = [],
    isLoading,
    isError,
  } = useAttendeesByOrganizer(organizerId);

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />

      <div className="ml-[16.5rem] flex-1 flex flex-col">
        <NavBar />

        <main className="p-4 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-4 text-left">
            <h1 className="text-3xl font-black tracking-tight">
              Attendee List
            </h1>
            <p
              className="mt-2 font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Total Registrants:{" "}
              <span
                className="font-bold"
                style={{ color: "var(--accent-color)" }}
              >
                {attendees.length}
              </span>
            </p>
          </div>

          {/* Attendees List Component */}
          <AttendeesList
            attendees={attendees}
            isLoading={isLoading}
            isError={isError}
          />
        </main>
      </div>
    </div>
  );
};

export default Attendees;
