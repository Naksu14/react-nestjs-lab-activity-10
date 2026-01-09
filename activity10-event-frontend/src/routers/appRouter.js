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

import EventAdminSidePage from "../modules/pages/adminSidePages/event-adminSide-page";

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

        {/* Protected Routes (Only accessible if logged in) */}
        <Route path="/organizer" element={<EventOrganizerPage />} />
        <Route path="/myevents" element={<MyEvent />} />
        <Route path="/attendees" element={<Attendees />} />
        <Route path="/scanner" element={<QrScanner />} />
        <Route path="/announcements" element={<Announcements />} />

        <Route path="/admin" element={<EventAdminSidePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
