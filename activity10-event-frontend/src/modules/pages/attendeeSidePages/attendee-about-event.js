import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import fallbackImage from "../../../assets/images/sample-event-1.jpg";
import { getCurrentUser } from "../../../services/authService";
import { registerForEvent, getRegistrationCount, getUserRegistrationForEvent, cancelRegistration } from "../../../services/attendeesService";
import { MapPin, Clock, Users } from "lucide-react";
import { useQuery as useAnnouncementsQuery } from "@tanstack/react-query";
import { getAnnouncementsByEvent } from "../../../services/organizerService";

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
    const queryClient = useQueryClient();
    const { state } = useLocation();
    const event = state?.event;

    const normalized = useMemo(() => {
        if (!event) return null;
        const startRaw = event.startDate || event.start_datetime || event.startDateTime;
        const endRaw = event.endDate || event.end_datetime || event.endDateTime;
        const startDate = startRaw ? new Date(startRaw) : null;
        const endDate = endRaw ? new Date(endRaw) : null;
        const startTimeMs = startDate ? startDate.getTime() : null;
        const fallbackDurationMs = 24 * 60 * 60 * 1000; // default to one day if no explicit end
        const endTimeMs = endDate
            ? endDate.getTime()
            : startDate
                ? startTimeMs + fallbackDurationMs
                : null;

        return {
            id: event.id ?? event.event_id,
            title: event.title,
            description: event.description || "No description provided.",
            location: event.location || "Location to be announced",
            capacity: event.capacity,
            status: event.status || "",
            statusLabel: event.statusLabel || event.status || "Status",
            dateRange: formatDateRange(startDate, endDate),
            host: event.organizer?.full_name || event.organizer?.name || "Organizer",
            imageUrl: getImage(event),
            startDate,
            startTimeMs,
            endDate,
            endTimeMs,
        };
    }, [event]);

    const [timeLeft, setTimeLeft] = useState({ kind: "unknown" });
    const [cancelling, setCancelling] = useState(false);
    const [registerError, setRegisterError] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState(null);

    const { data: currentUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser(),
    });

    const { data: registrationCount } = useQuery({
        queryKey: ["registration-count", normalized?.id],
        queryFn: () => getRegistrationCount(normalized.id),
        enabled: Boolean(normalized?.id),
    });

    const { data: announcements, isLoading: isAnnouncementsLoading } = useAnnouncementsQuery({
        queryKey: ["event-announcements", normalized?.id],
        queryFn: () => getAnnouncementsByEvent(normalized.id),
        enabled: Boolean(normalized?.id),
    });

    const { data: userRegistration } = useQuery({
        queryKey: ["user-registration", normalized?.id, currentUser?.id],
        queryFn: () => getUserRegistrationForEvent(normalized.id, currentUser.id),
        enabled: Boolean(normalized?.id && currentUser?.id),
        refetchInterval: (data) => ((data?.email_status || "").toLowerCase() === "pending" ? 5000 : false),
        refetchOnWindowFocus: (data) => ((data?.email_status || "").toLowerCase() === "pending"),
    });

    useEffect(() => {
        const isPending = (userRegistration?.email_status || "").toLowerCase() === "pending";
        if (!isPending || !normalized?.id || !currentUser?.id) return;

        const timer = setInterval(() => {
            queryClient.invalidateQueries({ queryKey: ["user-registration", normalized.id, currentUser.id] });
        }, 1000);

        return () => clearInterval(timer);
    }, [userRegistration?.email_status, userRegistration?.id, normalized?.id, currentUser?.id, queryClient]);

    const isCompletedStatus = (normalized?.status || normalized?.statusLabel || "").toLowerCase().includes("completed");

    useEffect(() => {
        if (isCompletedStatus) {
            setTimeLeft({ kind: "completed" });
            return;
        }

        if (!normalized?.startTimeMs) {
            setTimeLeft({ kind: "unknown" });
            return;
        }

        const compute = () => {
            const now = Date.now();
            const startMs = normalized.startTimeMs;
            const endMs = normalized.endTimeMs ?? startMs;

            if (now >= endMs) {
                return { kind: "completed" };
            }

            if (now >= startMs) {
                return { kind: "ongoing" };
            }

            const diff = startMs - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            return { kind: "upcoming", days, hours, minutes, seconds };
        };

        setTimeLeft(compute());
        const id = setInterval(() => {
            setTimeLeft(compute());
        }, 1000);

        return () => clearInterval(id);
    }, [normalized?.startTimeMs, normalized?.endTimeMs, isCompletedStatus]);

    const isRegisterEnabled = normalized?.status === "published" && !isCompletedStatus;

    const alreadyRegistered = (userRegistration?.registration_status || "").toLowerCase() === "registered";
    const isEmailPending = (userRegistration?.email_status || "").toLowerCase() === "pending";
    const showCancel = alreadyRegistered;

    const registerMutation = useMutation({
        mutationFn: ({ eventId, userId }) => registerForEvent({ eventId, userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["registration-count", normalized?.id] });
            queryClient.invalidateQueries({ queryKey: ["user-registration", normalized?.id, currentUser?.id] });
            queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
            queryClient.invalidateQueries({ queryKey: ["registrations-all"] });
            setRegisterSuccess("You're registered! Your ticket email will arrive shortly.");
        },
        onError: (err) => {
            setRegisterError(err?.message || "Registration failed. Please try again.");
        },
    });

    const handleRegister = async () => {
        if (!isRegisterEnabled || registerMutation.isPending || alreadyRegistered) return;

        if (!currentUser) {
            navigate("/login");
            return;
        }

        try {
            setRegisterError(null);
            setRegisterSuccess(null);
            await registerMutation.mutateAsync({ eventId: normalized.id, userId: currentUser.id });
        } catch (err) {
            setRegisterError(err?.message || "Registration failed. Please try again.");
        }
    };

    const handleCancel = async () => {
        if (!userRegistration?.id || cancelling) return;
        try {
            setRegisterError(null);
            setRegisterSuccess(null);
            setCancelling(true);
            await cancelRegistration(userRegistration.id);
            setRegisterSuccess("Registration cancelled.");
            queryClient.invalidateQueries({ queryKey: ["registration-count", normalized.id] });
            queryClient.invalidateQueries({ queryKey: ["user-registration", normalized.id, currentUser?.id] });
            queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
            queryClient.invalidateQueries({ queryKey: ["registrations-all"] });
        } catch (err) {
            setRegisterError(err.message || "Unable to cancel registration.");
        } finally {
            setCancelling(false);
        }
    };

    if (!normalized) {
        return (
            <div className="min-h-screen bg-[var(--bg-main)] text-left">
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
        <div className="min-h-screen bg-[var(--bg-main)] text-left">
            <Header />

            <section className="pt-[96px] max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2">
                    <div
                        className="relative overflow-hidden rounded-lg border shadow-xl shadow-black/5"
                        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
                    >
                        <div className="relative h-80 w-full">
                            <img
                                src={normalized.imageUrl}
                                alt={normalized.title}
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                            <div className="absolute bottom-6 left-6 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] bg-white text-black">
                                        {normalized.statusLabel}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white leading-tight drop-shadow">
                                    {normalized.title}
                                </h1>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div
                                className="flex items-center gap-3 border-b pb-4"
                                style={{ borderColor: "var(--border-color)" }}
                            >
                                <div className="h-8 w-1.5 rounded-full bg-[var(--accent-color)]" />
                                <h2
                                    className="text-xl font-bold tracking-tight"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    About this event
                                </h2>
                            </div>

                            <div className="prose prose-sm max-w-none">
                                {(normalized.description || "No description provided.")
                                    .split(/\n{2,}/)
                                    .map((p) => p.trim())
                                    .filter(Boolean)
                                    .map((para, idx) => (
                                        <p
                                            key={idx}
                                            className="text-[15px] leading-relaxed mb-4 last:mb-0 text-justify sm:text-left"
                                            style={{ color: "var(--text-muted)", fontWeight: 400 }}
                                        >
                                            {para}
                                        </p>
                                    ))}
                            </div>
                        </div>
                        <section className="max-w-7xl mx-auto px-4 mt-4 mb-5">
                            <div
                                className="rounded-lg border p-6 shadow-sm"
                                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2
                                        className="text-sm font-bold uppercase tracking-wider"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        Event Updates
                                    </h2>
                                </div>

                                {isAnnouncementsLoading ? (
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                        Loading updates...
                                    </p>
                                ) : !announcements || announcements.length === 0 ? (
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                        No announcements for this event yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {announcements.map((a) => (
                                            <div
                                                key={a.id}
                                                className="p-4 rounded-lg"
                                                style={{
                                                    backgroundColor: "var(--bg-secondary)",
                                                    border: "1px solid var(--border-color)",
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3
                                                        className="text-sm font-semibold"
                                                        style={{ color: "var(--text-primary)" }}
                                                    >
                                                        {a.title}
                                                    </h3>
                                                    <span
                                                        className="text-[11px]"
                                                        style={{ color: "var(--text-muted)" }}
                                                    >
                                                        {new Date(a.sent_at).toLocaleString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-xs"
                                                    style={{ color: "var(--text-muted)" }}
                                                >
                                                    {a.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="flex flex-col items-center self-start">
                    <div
                        className="rounded-2xl shadow-lg border overflow-hidden w-full"
                        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
                    >
                        {!isCompletedStatus ? (
                            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                            Event Status
                                        </span>
                                        {timeLeft.kind === "completed" ? (
                                            <span className="text-base font-semibold text-emerald-600">Completed</span>
                                        ) : timeLeft.kind === "ongoing" ? (
                                            <span className="text-base font-semibold text-blue-600">Ongoing</span>
                                        ) : timeLeft.kind === "upcoming" ? (
                                            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                                Starts in {timeLeft.days}d · {timeLeft.hours}h · {timeLeft.minutes}m · {timeLeft.seconds}s
                                            </span>
                                        ) : (
                                            <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                                                Countdown unavailable
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${timeLeft.kind === "completed"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : timeLeft.kind === "ongoing"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                                            }`}
                                    >
                                        {timeLeft.kind === "completed"
                                            ? "Completed"
                                            : timeLeft.kind === "ongoing"
                                                ? "Ongoing"
                                                : timeLeft.kind === "upcoming"
                                                    ? "Upcoming"
                                                    : "Unknown"}
                                    </span>
                                </div>
                            </div>
                        ) : null}

                        <div className="p-6 flex flex-col space-y-5 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                                {registrationCount !== undefined && !isCompletedStatus ? (
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold">
                                        Registered: {registrationCount}
                                        {normalized.capacity ? ` / ${normalized.capacity}` : ""}
                                    </span>
                                ) : null}
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                                    {normalized.statusLabel}
                                </span>
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center font-bold">
                                        {normalized.title?.[0] ?? "E"}
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>
                                            Event
                                        </p>
                                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                            {normalized.title}
                                        </p>
                                    </div>
                                </div>

                                <hr style={{ borderColor: "var(--border-color)" }} />

                                <div className="flex gap-4">
                                    <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                                            Location
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                            {normalized.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                                            Date & Time
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                            {normalized.dateRange}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                                            Capacity
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                            {normalized.capacity ? `${normalized.capacity} Spots` : "TBA"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={`mt-1 w-full py-3 rounded-lg font-semibold text-base transition shadow ${alreadyRegistered
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : isRegisterEnabled
                                            ? "bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                                disabled={!isRegisterEnabled || registerMutation.isPending || alreadyRegistered}
                                aria-disabled={!isRegisterEnabled || registerMutation.isPending || alreadyRegistered}
                                onClick={handleRegister}
                            >
                                {alreadyRegistered
                                    ? "Already registered"
                                    : registerMutation.isPending
                                        ? "Registering..."
                                        : isRegisterEnabled
                                            ? "Register Now"
                                            : "Registration unavailable"}
                            </button>
                            {registerSuccess ? (
                                <p className="text-sm text-green-600 mt-2">{registerSuccess}</p>
                            ) : null}
                            {registerError ? (
                                <p className="text-sm text-red-600 mt-2">{registerError}</p>
                            ) : null}
                            <div className="mt-4 flex flex-wrap gap-3 justify-start">
                                <button
                                    className={`${showCancel ? "" : "w-full"} px-6 py-2 rounded bg-gray-200 text-[var(--accent-color)] font-semibold text-base shadow hover:bg-gray-300 transition`}
                                    onClick={() => navigate(-1)}
                                >
                                    Return to Events
                                </button>
                                {showCancel ? (
                                    <button
                                        className="px-6 py-2 rounded bg-red-100 text-red-700 font-semibold text-base shadow hover:bg-red-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={handleCancel}
                                        disabled={cancelling || !isEmailPending}
                                        title={isEmailPending ? "" : "Cancellation disabled after ticket email is processed"}
                                    >
                                        {cancelling ? "Cancelling..." : isEmailPending ? "Cancel" : "Cancel disabled"}
                                    </button>
                                ) : null}
                            </div>
                            {showCancel && !isEmailPending ? (
                                <p className="text-xs text-gray-500">Cancellation is only available before the ticket email is processed.</p>
                            ) : null}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 text-center">
                        Hosted by <span className="font-semibold text-[var(--accent-color)]">{normalized.host}</span>
                    </p>
                </div>
            </section>


        </div>
    );
};

export default AboutEvent;
