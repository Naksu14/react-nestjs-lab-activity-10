import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../modules/auth/login";
import Signup from "../modules/auth/signup";
import ForgotPassword from "../modules/auth/forgotpassword";
import AuthGuard from "../components/auth/AuthGuard";
import GuestGuard from "../components/auth/GuestGuard";
import EventLandingPage from "../modules/pages/attendeeSidePages/event-landing-page";

import EventOrganizerPage from "../modules/pages/organizerSidePages/event-organizer-page";
import MyEvent from "../modules/pages/organizerSidePages/event-page";
import Attendees from "../modules/pages/organizerSidePages/attendees-page";
import QrScanner from "../modules/pages/organizerSidePages/qr-scanner-page";
import Announcements from "../modules/pages/organizerSidePages/announcement-page";

import AboutEvent from "../modules/pages/attendeeSidePages/attendee-about-event";
import AttendeeTickets from "../modules/pages/attendeeSidePages/attendee-tickets";
import OrganizerPage from "../modules/pages/adminSidePages/event-OrganizerPage";

import EventAdminSidePage from "../modules/pages/adminSidePages/event-adminSide-page";
import EventReportsPage from "../modules/pages/adminSidePages/event-reports-page";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Only accessible if NOT logged in */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public landing page as main page */}
        <Route path="/" element={<EventLandingPage />} />
        <Route path="/landing" element={<EventLandingPage />} />
        <Route path="/events" element={<AboutEvent />} />
        <Route path="/tickets" element={<AttendeeTickets />} />

        {/* Protected Routes (Only accessible if logged in) */}
        <Route path="/organizer" element={<EventOrganizerPage />} />
        <Route path="/organizer/myevents" element={<MyEvent />} />
        <Route path="/organizer/attendees" element={<Attendees />} />
        <Route path="/organizer/scanner" element={<QrScanner />} />
        <Route path="/organizer/announcements" element={<Announcements />} />

        <Route path="/admin" element={<EventAdminSidePage />} />
        <Route path="/admin/user-management" element={<OrganizerPage />} />
        <Route path="/admin/reports" element={<EventReportsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
