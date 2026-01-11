import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import { Camera, CheckCircle, XCircle, RefreshCw, Upload, User, Calendar, Ticket, Clock, ArrowLeft } from "lucide-react";
import { findticketByCode, createEventCheckin, getEventCheckinsByScannedby, updateTicket } from "../../../services/eventsService";
import { getCurrentUser } from "../../../services/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const QrScanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Get event info from navigation state (when coming from viewEvent)
  const eventFromState = location.state?.eventId ? {
    id: location.state.eventId,
    title: location.state.eventTitle
  } : null;
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  const {
    data: currentUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });
  
  const { data: previousCheckins } = useQuery({
    queryKey: ["eventCheckins", currentUser?.id],
    queryFn: () => getEventCheckinsByScannedby(currentUser?.id),
    enabled: !!currentUser?.id,
  });

  // Filter checkins by selected event if provided via navigation state
  const filteredCheckins = (previousCheckins || []).filter((checkin) => !eventFromState?.id || checkin.event_id === eventFromState.id);
  
  const stopCamera = useCallback(() => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
    setIsActive(false);
  }, []);

  const initScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
    }
  };

  const handleScanResult = async (code, source) => {
      // Stop camera only if it's running
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        setIsActive(false);
      }
      setAlreadyCheckedIn(false);
      setError(null);

      try {
        const ticketData = await findticketByCode(code);
        setScanResult(ticketData);
        
        if (ticketData.status === "used") {
          setError("This ticket has already been used for check-in!");
          setAlreadyCheckedIn(true);
          startCamera();
        } else if (ticketData.status === "cancelled") {
          setError("This ticket has been cancelled!");
          setAlreadyCheckedIn(true);
          startCamera();
        } else if (ticketData.status !== "valid") {
          setError(`Invalid ticket status: ${ticketData.status}`);
          setAlreadyCheckedIn(true);
          startCamera();
        } else if (new Date(ticketData.event.start_datetime) > new Date()) {
          const startDate = new Date(ticketData.event.start_datetime).toLocaleString();
          setError(`Event has not started yet. Starts at: ${startDate}`);
          setAlreadyCheckedIn(true);
          startCamera();
        } else if (new Date(ticketData.event.end_datetime) < new Date()) {
          const endDate = new Date(ticketData.event.end_datetime).toLocaleString();
          setError(`Event has already ended on: ${endDate}`);
          setAlreadyCheckedIn(true);
          startCamera();
        } else {
          // Valid ticket - create new checkin
          try {
            await createEventCheckin({
              ticket_id: ticketData.id,
              event_id: ticketData.event_id,
              scanned_by: currentUser?.id,
              scan_time: new Date().toISOString(),
            });

            await updateTicket(ticketData.id, { status: "used" });
            
            queryClient.invalidateQueries({ queryKey: ["eventCheckins", currentUser?.id] });
            setAlreadyCheckedIn(false);
            startCamera();
          } catch (err) {
            console.error("Check-in error:", err);
            setError(err.response?.data?.message || "Failed to record check-in. Please try again.");
            setAlreadyCheckedIn(true);
          }
        }
      } catch (err) {
        console.error("Ticket lookup error:", err);
        setScanResult(null);
        setError("Ticket not found or invalid QR code!");
        setAlreadyCheckedIn(true);
        startCamera();
      }
  };

  // Scan using camera
  const startCamera = async () => {
    try {
      initScanner();

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => handleScanResult(decodedText, "camera"),
        () => {} // ignore scan errors
      );

      setIsActive(true);
    } catch {
      setError("Camera access denied or not available");
    }
  };

  // Scan QR from uploaded image
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    try {
      // Stop camera if running before file scan
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        setIsActive(false);
      }

      // Create a fresh scanner instance for file scanning
      const fileScanner = new Html5Qrcode("qr-reader");
      const result = await fileScanner.scanFile(file, true);
      
      // Clear the file scanner
      await fileScanner.clear();

      await handleScanResult(result, "file");
    } catch (err) {
      setError("No QR code found in image");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const reset = () => {
    setError(null);
    setScanResult(null);
    setAlreadyCheckedIn(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);
  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />

      <div className=" ml-[16.5rem] flex-1 flex flex-col">
        <NavBar />

        <main className="p-8 max-w-7xl mx-auto w-full">
            {/* Scanner Panel */}
            <div className="col-span-1 lg:col-span-2">
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="p-4 flex items-center gap-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                  <button
                    onClick={() => {
                      // Stop camera before navigating
                      if (scannerRef.current && scannerRef.current.isScanning) {
                        scannerRef.current.stop().catch(() => {});
                      }
                      navigate('/organizer/myevents', { 
                        state: { selectedEventId: eventFromState?.id } 
                      });
                    }}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                    }}
                    title="Back to My Events"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex-1">
                    <h2
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Event Check-In Scanner {eventFromState?.title && ` - ${eventFromState.title}`}
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Use your device camera to scan attendee ticket QR codes.
                  </p>
                  </div>
                </div>

                <div className="p-6 flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-1 min-w-80 min-h-60 max-w-full">
                    <div className="relative border rounded-lg" style={{ borderColor: "var(--border-color)" }}>
                      <div
                        id="qr-reader"
                        className="w-full h-80 rounded-lg overflow-hidden"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      />
                      <div
                        className="absolute left-4 top-4 px-3 py-1 rounded-md flex items-center z-10"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.35)",
                          color: "#fff",
                        }}
                      >
                        <Camera size={14} className="inline-block mr-2" />
                        <span title={isActive ? "Camera is live" : "Camera is inactive"}>{isActive ? "Live" : "Inactive"}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-3">
                      <button
                        onClick={startCamera}
                        disabled={isActive}
                        title="Start camera"
                        className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                        style={{
                          backgroundColor: "var(--accent-color)",
                          color: "#fff",
                        }}
                      >
                        Start
                      </button>
                      <button
                        onClick={stopCamera}
                        disabled={!isActive}
                        title="Stop camera"
                        className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                        style={{ backgroundColor: "#f87171", color: "#fff" }}
                      >
                        Stop
                      </button>
                      <button
                        onClick={reset}
                        title="Reset scanner"
                        className="px-3 py-3 rounded-lg"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <RefreshCw size={16} />
                      </button>

                      {/* Upload QR Image */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="qr-upload"
                      />
                      <label
                        htmlFor="qr-upload"
                        title="Upload image with QR code"
                        className="px-4 py-2 rounded-2xl font-semibold cursor-pointer flex items-center"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Upload size={16} className="mr-2" />
                        Upload
                      </label>
                    </div>
                  </div>

                  <div className="w-full md:w-2/4">
                    <div
                      className="p-5 rounded-lg shadow-sm text-left"
                      style={{
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-card)",
                      }}
                    >
                      <div className="flex justify-between items-center gap-2 mb-4">
                        <h3
                          className="font-bold text-base"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Scan Result
                        </h3>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}
                        >
                          {scanResult?.registration.registration_status || "No Ticket Scanned"}
                        </span>
                      </div>

                      <div>
                        {/* Already Checked In Warning */}
                        {alreadyCheckedIn && error && (
                          <div
                            className="py-3 px-4 rounded-xl mb-4 flex items-center gap-2"
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              color: "#ef4444",
                            }}
                          >
                            <XCircle size={18} className="shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                          </div>
                        )}

                        {/* New Check-in Success */}
                        {scanResult && !alreadyCheckedIn && !error && (
                          <div
                            className="py-3 px-4 rounded-xl mb-4 flex items-center gap-2"
                            style={{
                              backgroundColor: "rgba(34, 197, 94, 0.1)",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                              color: "#22c55e",
                            }}
                          >
                            <CheckCircle size={18} />
                            <span className="text-sm font-medium">Check-in successful!</span>
                          </div>
                        )}

                        {scanResult ? (
                          <div className="space-y-4">
                            {/* Attendee */}
                            <div className="flex items-start gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "var(--bg-secondary)" }}
                              >
                                <User size={18} style={{ color: "var(--text-muted)" }} />
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
                                  Attendee
                                </p>
                                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                                  {scanResult.registration?.user
                                    ? `${scanResult.registration.user.firstname} ${scanResult.registration.user.lastname}`
                                    : "-"}
                                </p>
                              </div>
                            </div>

                            {/* Event */}
                            <div className="flex items-start gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "var(--bg-secondary)" }}
                              >
                                <Calendar size={18} style={{ color: "var(--text-muted)" }} />
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
                                  Event
                                </p>
                                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                                  {scanResult.event?.title_event || scanResult.event?.title || "-"}
                                </p>
                              </div>
                            </div>

                            {/* Start Time */}
                            <div className="flex items-start gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "var(--bg-secondary)" }}
                              >
                                <Clock size={18} style={{ color: "var(--text-muted)" }} />
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
                                  Start Date & Time
                                </p>
                                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                                  {scanResult.event?.start_datetime
                                    ? new Date(scanResult.event.start_datetime).toLocaleString()
                                    : "-"}
                                </p>
                              </div>
                            </div>
                            {/* End Date & Time */}
                            <div className="flex items-start gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "var(--bg-secondary)" }}
                              >
                                <Clock size={18} style={{ color: "var(--text-muted)" }} />
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
                                  End Date & Time
                                </p>
                                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                                  {scanResult.event?.end_datetime
                                    ? new Date(scanResult.event.end_datetime).toLocaleString()
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                              style={{ backgroundColor: "var(--bg-secondary)" }}
                            >
                              <Camera size={28} style={{ color: "var(--text-muted)" }} />
                            </div>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                              No code scanned yet
                            </p>
                            <p className="text-xs mt-1 opacity-70" style={{ color: "var(--text-muted)" }}>
                              Point your camera at a QR code
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* History moved below scanner */}
              <div className="mt-6">
                <div
                  className="rounded-lg p-5 shadow-lg"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <Clock size={16} style={{ color: "var(--text-muted)" }} />
                    </div>
                    <h3
                      className="font-bold text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Attendee Check-In List {eventFromState?.title && ` - ${eventFromState.title}`}
                    </h3>
                    {filteredCheckins.length > 0 && (
                      <span
                        className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}
                      >
                        {filteredCheckins.length} check-in{filteredCheckins.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div
                    className="space-y-2 max-h-96 overflow-auto"
                  >
                    {filteredCheckins.length === 0 && (
                      <div className="text-center py-8">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                          style={{ backgroundColor: "var(--bg-secondary)" }}
                        >
                          <Ticket size={24} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
                        </div>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                          No check-ins yet
                        </p>
                      </div>
                    )}
                    {filteredCheckins
                    .map((checkin) => (
                      <div
                        key={checkin.id}
                        className="p-4 rounded-xl transition-colors hover:opacity-90"
                        style={{
                          border: "1px solid var(--border-color)",
                          backgroundColor: "var(--bg-secondary)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: "var(--bg-card)" }}
                            >
                              <User size={18} style={{ color: "var(--accent-color)" }} />
                            </div>
                            <div>
                              <p
                                className="font-semibold text-sm"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {checkin.ticket?.registration?.user
                                  ? `${checkin.ticket.registration.user.firstname} ${checkin.ticket.registration.user.lastname}`
                                  : "Unknown Attendee"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                              style={{
                                backgroundColor: checkin.scan_status === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: checkin.scan_status === "success" ? "#22c55e" : "#ef4444",
                              }}
                            >
                              {checkin.scan_status || "success"}
                            </span>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {checkin.scan_time
                                ? new Date(checkin.scan_time).toLocaleString()
                                : "-"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 flex items-center gap-4" style={{ borderTop: "1px solid var(--border-color)" }}>
                          <div className="flex items-center gap-1.5">
                            <Ticket size={12} style={{ color: "var(--text-muted)" }} />
                            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                              {checkin.event?.title_event || "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} style={{ color: "var(--text-muted)" }} />
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {checkin.event?.start_datetime
                                ? new Date(checkin.event.start_datetime).toLocaleDateString()
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

        </main>
      </div>
    </div>
  );
};

export default QrScanner;
