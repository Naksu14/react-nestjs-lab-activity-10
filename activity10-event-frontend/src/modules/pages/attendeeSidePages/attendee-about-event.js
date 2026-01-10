import React, { useEffect, useMemo, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import fallbackImage from "../../../assets/images/sample-event-1.jpg";

const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return "Date to be announced";
    const opts = { month: "short", day: "numeric", year: "numeric" };
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end) {
        return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
    }
    return (start || end)?.toLocaleDateString("en-US", opts) || "Date to be announced";
};

const getImage = (event) => event?.imageUrl || fallbackImage;

const AboutEvent = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const event = state?.event;

    const normalized = useMemo(() => {
        if (!event) return null;
        return {
            title: event.title,
            description: event.description || "No description provided.",
            location: event.location || "Location to be announced",
            capacity: event.capacity,
            status: event.status || "",
            statusLabel: event.statusLabel || event.status || "Status",
            dateRange: formatDateRange(event.startDate, event.endDate || event.startDate),
            host: event.organizer?.full_name || event.organizer?.name || "Organizer",
            imageUrl: getImage(event),
            startDate: event.startDate ? new Date(event.startDate) : null,
        };
    }, [event]);

    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!normalized?.startDate) {
            setTimeLeft(null);
            return;
        }

        const compute = () => {
            const now = new Date();
            const diff = normalized.startDate.getTime() - now.getTime();
            if (diff <= 0) {
                return null;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            return { days, hours, minutes, seconds };
        };

        setTimeLeft(compute());
        const id = setInterval(() => {
            setTimeLeft(compute());
        }, 1000);

        return () => clearInterval(id);
    }, [normalized?.startDate]);

    const isRegisterEnabled = normalized?.status === "published";

    if (!normalized) {
        return (
            <div className="min-h-screen bg-white text-left">
                <Header />
                <section className="pt-[96px] max-w-5xl mx-auto px-4 flex flex-col items-start gap-4">
                    <h1 className="text-2xl font-bold text-[var(--accent-color)]">No event selected</h1>
                    <p className="text-gray-600">Go back and pick an event from the landing page.</p>
                    <button
                        className="px-6 py-3 rounded bg-[var(--accent-color)] text-white font-semibold shadow hover:bg-[var(--accent-color)]/90 transition"
                        onClick={() => navigate(-1)}
                    >
                        Return to Events
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-left">
            <Header />

            <section className="pt-[96px] max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-gray-100 h-[420px]">
                    <img
                        src={normalized.imageUrl}
                        alt={normalized.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                <div className="flex flex-col items-center self-start">
                    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden w-full">
                        <div className="bg-[var(--accent-color)] px-5 py-3">
                            <p className="text-sm font-semibold text-white flex flex-col gap-1">
                                <span>Event Countdown</span>
                                {timeLeft ? (
                                    <span className="text-xs text-white/90">
                                        {timeLeft.days}d · {timeLeft.hours}h · {timeLeft.minutes}m · {timeLeft.seconds}s remaining
                                    </span>
                                ) : (
                                    <span className="text-xs text-white/80">Countdown unavailable</span>
                                )}
                            </p>
                        </div>
                        <div className="p-6 flex flex-col space-y-5 text-left">
                            <span className="text-sm font-semibold uppercase text-[var(--accent-color)]">
                                Event Title
                            </span>
                            <h1 className="text-2xl font-bold leading-snug">
                                {normalized.title}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                {normalized.capacity ? (
                                    <span className="text-xs bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-2 py-1 rounded font-semibold">
                                        Capacity: {normalized.capacity}
                                    </span>
                                ) : null}
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                                    {normalized.statusLabel}
                                </span>
                            </div>
                            <p className="text-base text-gray-500">
                                {normalized.dateRange}
                            </p>
                            <p className="text-base font-medium">
                                {normalized.location}
                            </p>
                            <button
                                className={`mt-3 w-full py-3 rounded-lg font-semibold text-base transition shadow ${
                                    isRegisterEnabled
                                        ? "bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={!isRegisterEnabled}
                                aria-disabled={!isRegisterEnabled}
                            >
                                {isRegisterEnabled ? "Register Now" : "Registration unavailable"}
                            </button>
                            <button
                                className="mt-6 px-6 py-2 rounded bg-gray-200 text-[var(--accent-color)] font-semibold text-base shadow hover:bg-gray-300 transition"
                                onClick={() => navigate(-1)}
                            >
                                Return to Events
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 text-center">
                        Hosted by <span className="font-semibold text-[var(--accent-color)]">{normalized.host}</span>
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 mt-2">
                <h2 className="text-xl font-bold mb-4">About event</h2>

                <p className="text-base text-gray-600 leading-relaxed max-w-4xl">
                    {normalized.description}
                </p>
            </section>
        </div>
    );
};

export default AboutEvent;
