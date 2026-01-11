import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaExternalLinkAlt, FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import useLandingEvents from "../hooks/landingHooks/event-landinghook";
import { getAllRegistrations } from "../services/attendeesService";
import fallbackImage from "../assets/images/sample-event-1.jpg";

const filters = [
  { label: "Published Events", type: "published" },
  { label: "Completed Events", type: "completed" },
];

const EventsSection = () => {
  const navigate = useNavigate();
  const { events, loading, error } = useLandingEvents();
  const [activeFilter, setActiveFilter] = useState(filters[0].type);
  const [activePage, setActivePage] = useState(0);
  const cardsPerPage = 3;

  const { data: registrations } = useQuery({
    queryKey: ["registrations-all"],
    queryFn: () => getAllRegistrations(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const registrationCounts = useMemo(() => {
    const counts = {};
    (registrations || []).forEach((reg) => {
      const id = Number(reg.event_id);
      const isRegistered = (reg.registration_status || "").toLowerCase() === "registered";
      if (!Number.isNaN(id) && isRegistered) {
        counts[id] = (counts[id] || 0) + 1;
      }
    });
    return counts;
  }, [registrations]);

  const filteredEvents = useMemo(
    () => events.filter((event) => event.status === activeFilter),
    [events, activeFilter]
  );

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < filteredEvents.length; i += cardsPerPage) {
      chunks.push(filteredEvents.slice(i, i + cardsPerPage));
    }
    return chunks.length ? chunks : [[]];
  }, [filteredEvents]);

  const pageCount = pages.length;
  const currentPage = Math.min(activePage, pageCount - 1);
  const pagedEvents = pages[currentPage];

  useEffect(() => {
    setActivePage(0);
  }, [activeFilter, filteredEvents.length]);

  const handlePrev = () => {
    setActivePage((prev) => (prev - 1 + pageCount) % pageCount);
  };

  const handleNext = () => {
    setActivePage((prev) => (prev + 1) % pageCount);
  };

  const formatDateTime = (date) => {
    if (!date) return "Date to be announced";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getImage = (event) => event?.imageUrl || fallbackImage;

  return (
    <>
      <section className="w-[95%] max-w-6xl mx-auto mt-10 px-4 flex flex-col items-start text-left">
        <div className="flex gap-2 mb-6 w-full justify-center">
          {filters.map((filter) => (
            <button
              key={filter.type}
              className={`px-5 py-2 rounded-md font-semibold text-sm md:text-base transition-colors border border-[var(--accent-color)] focus:outline-none ${activeFilter === filter.type
                  ? "bg-[var(--accent-color)] text-white shadow"
                  : "bg-white text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10"
                }`}
              onClick={() => {
                setActiveFilter(filter.type);
                setActivePage(0);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${pageCount ? (currentPage * (100 / pageCount)) : 0}%)`,
              width: `${pageCount * 100}%`,
            }}
          >
            {pages.map((page, pageIdx) => (
              <div
                key={pageIdx}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full shrink-0"
                style={{ width: `${100 / pageCount}%` }}
              >
                {loading ? (
                  <div className="col-span-full text-center text-gray-500 py-12">Loading events…</div>
                ) : error ? (
                  <div className="col-span-full text-center text-red-500 py-12">{error}</div>
                ) : page.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-12">No events found.</div>
                ) : (
                  page.map((event) => (
                    <div
                      key={event.id}
                      className="group bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition-transform hover:scale-[1.02] border border-gray-100 relative"
                    >
                      <img
                        src={getImage(event)}
                        alt={event.title}
                        className="w-full h-40 object-cover object-center"
                        draggable={false}
                      />
                      <div className="flex-1 flex flex-col p-4 gap-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg md:text-xl font-bold text-[var(--accent-color)] truncate">
                            {event.title}
                          </h3>

                        </div>
                        <span className="text-xs md:text-sm text-gray-600">
                          {event.location || "Location to be announced"}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500">
                          {formatDateTime(event.startDate)}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          {activeFilter !== "completed" ? (
                            <span className="text-[11px] md:text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold">
                              Registered: {registrationCounts[event.id] ?? 0}
                              {event.capacity ? ` / ${event.capacity}` : ""}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-10">
                        <button
                          onClick={() =>
                            navigate(`/events`, {
                              state: { event },
                            })
                          }
                          className="px-5 py-2 rounded-md bg-[var(--accent-color)] text-white font-semibold shadow-lg hover:bg-[var(--accent-color)]/90 transition-colors flex items-center gap-2"
                        >
                          See Details <FaExternalLinkAlt className="text-xs mb-[1px]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>

          <button
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 border border-gray-200 shadow rounded-full w-10 h-10 items-center justify-center hover:bg-white transition"
            onClick={handlePrev}
            aria-label="Previous events"
            disabled={loading || error}
          >
            ‹
          </button>
          <button
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 border border-gray-200 shadow rounded-full w-10 h-10 items-center justify-center hover:bg-white transition"
            onClick={handleNext}
            aria-label="Next events"
            disabled={loading || error}
          >
            ›
          </button>
        </div>
        <div className="flex justify-center w-full mt-8">
          {Array.from({ length: pageCount }).map((_, idx) => (
            <button
              key={idx}
              className={`mx-1 w-6 h-2 rounded-full transition-all duration-200 ${idx === activePage ? "bg-[var(--accent-color)]" : "bg-gray-300 hover:bg-[var(--accent-color)]/40"
                }`}
              onClick={() => setActivePage(idx)}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </section>
      <footer className="w-full max-w-6xl mx-auto px-0 mt-16 relative overflow-visible">
        <div className="w-full relative" style={{ height: "140px" }}>
          <svg
            className="absolute left-0 top-0 w-full h-36"
            viewBox="0 0 1440 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M0,70 C480,210 960,0 1440,140 L1440,140 L0,140 Z" fill="#e5e7eb" />
          </svg>
        </div>
        <div className="w-full bg-[#e5e7eb] rounded-b-2xl shadow-sm border-t border-[var(--border-color)] -mt-2 px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-sm text-[var(--text-muted)]">
          <span>
            {new Date().getFullYear()} <span className="font-semibold text-[var(--accent-color)]">QRserve</span>. All rights reserved.
          </span>
          <div className="flex gap-4 justify-center mt-2 md:mt-0">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[var(--accent-color)] hover:text-pink-500 transition-colors text-xl">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-[var(--accent-color)] hover:text-blue-400 transition-colors text-xl">
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[var(--accent-color)] hover:text-blue-600 transition-colors text-xl">
              <FaFacebookF />
            </a>
            <a href="mailto:info@qrserve.com" aria-label="Gmail" className="text-[var(--accent-color)] hover:text-red-500 transition-colors text-xl">
              <SiGmail />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default EventsSection;
