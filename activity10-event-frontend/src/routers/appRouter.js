import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../modules/auth/login";
import Signup from "../modules/auth/signup";
import ForgotPassword from "../modules/auth/forgotpassword";
import ProtectedRoute from "../components/auth/ProtectedRoute";
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
import AdminTicketsPage from "../modules/pages/adminSidePages/admin-tickets-page";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Anyone can access */}
        <Route path="/" element={<EventLandingPage />} />
        <Route path="/landing" element={<EventLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/events" element={<AboutEvent />} />
        <Route path="/tickets" element={<AttendeeTickets />} />

        {/* Protected Admin Routes - Only admins */}
        <Route
          path="/admin/events-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EventAdminSidePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrganizerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EventReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/my-tickets"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTicketsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Organizer Routes - Only organizers */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EventOrganizerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/myevents"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <MyEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/attendees"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <Attendees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/scanner"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <QrScanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/announcements"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <Announcements />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
