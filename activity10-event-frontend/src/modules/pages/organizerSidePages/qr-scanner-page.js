import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import { Camera, CheckCircle, XCircle, RefreshCw, Upload } from "lucide-react";

const QrScanner = () => {
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scanned, setScanned] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const stopCamera = useCallback(() => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
    setIsActive(false);
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // On successful scan
          setScanned((prev) => {
            if (prev !== decodedText) {
              setHistory((h) =>
                [{ code: decodedText, at: Date.now() }, ...h].slice(0, 20)
              );
            }
            return decodedText;
          });
        },
        () => {} // Ignore scan errors
      );
      setIsActive(true);
    } catch (err) {
      setError("Camera access denied or not available");
      console.error(err);
    }
  };

  // Scan QR from uploaded image file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      const result = await scannerRef.current.scanFile(file, true);
      setScanned(result);
      setHistory((h) => [{ code: result, at: Date.now() }, ...h].slice(0, 20));
    } catch (err) {
      setError("No QR code found in image");
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const reset = () => {
    setScanned(null);
    setError(null);
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scanner Panel */}
            <div className="col-span-1 lg:col-span-2">
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="p-4">
                  <h2
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Check-in Scanner
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Use your device camera to scan attendee ticket QR codes.
                  </p>
                </div>

                <div className="p-6 flex flex-col md:flex-row items-start gap-6">
                  <div
                    style={{ minWidth: 320, minHeight: 240, maxWidth: "100%" }}
                    className="flex-1"
                  >
                    <div className="relative border rounded-lg" style={{ borderColor: "var(--border-color)" }}>
                      <div
                        id="qr-reader"
                        style={{
                          width: "100%",
                          height: 320,
                          backgroundColor: "var(--bg-secondary)",
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      />
                      <div
                        className="absolute left-4 top-4 px-3 py-1 rounded-md flex items-center z-10"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.35)",
                          color: "#fff",
                        }}
                      >
                        <Camera size={14} className="inline-block mr-2" />
                        <span>{isActive ? "Live" : "Inactive"}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-3">
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 rounded-lg font-semibold"
                        style={{
                          backgroundColor: "var(--accent-color)",
                          color: "#fff",
                        }}
                      >
                        Start
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2 rounded-lg font-semibold bg-red-400 hover:bg-red-600 transition-colors"
                      >
                        Stop
                      </button>
                      <button
                        onClick={reset}
                        className="px-3 py-2 rounded-lg"
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

                  <div className="w-full md:w-1/3">
                    <div
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-card)",
                      }}
                    >
                      <h3
                        className="font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Latest Scan
                      </h3>
                      <div className="mt-3">
                        {error && (
                          <div
                            className="py-2 px-3 rounded mb-2"
                            style={{
                              backgroundColor: "rgba(255,0,0,0.06)",
                              color: "var(--text-primary)",
                            }}
                          >
                            <XCircle size={14} className="inline-block mr-2" />{" "}
                            {error}
                          </div>
                        )}
                        {scanned ? (
                          <div>
                            <p
                              style={{
                                color: "var(--text-muted)",
                                fontSize: 12,
                              }}
                            >
                              Ticket Code
                            </p>
                            <p
                              className="font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {scanned}
                            </p>
                            <button
                              className="mt-3 px-3 py-2 rounded-2xl"
                              style={{
                                backgroundColor: "var(--accent-color)",
                                color: "#fff",
                              }}
                            >
                              <CheckCircle
                                size={16}
                                className="inline-block mr-2"
                              />{" "}
                              Verify
                            </button>
                          </div>
                        ) : (
                          <div style={{ color: "var(--text-muted)" }}>
                            No code scanned yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div>
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <h3
                  className="font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Scan History
                </h3>
                <div
                  className="mt-3 space-y-2"
                  style={{ maxHeight: 400, overflow: "auto" }}
                >
                  {history.length === 0 && (
                    <div style={{ color: "var(--text-muted)" }}>
                      No scans yet
                    </div>
                  )}
                  {history.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-secondary)",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        {h.code}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
                        {new Date(h.at).toLocaleTimeString()}
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
