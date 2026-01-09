import React, { useState } from "react";
import { FaExternalLinkAlt, FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useNavigate } from "react-router-dom";



const eventData = [
  {
    id: 1,
    type: "Public",
    title: "Open Tech Conference 2026",
    status: "180/200",
    image: require("../assets/images/sample-event-1.jpg"),
  },
  {
    id: 3,
    type: "Upcoming",
    title: "Startup Pitch Fest",
    status: "100/120",
    image: require("../assets/images/sample-event-1.jpg"),
  },
  {
    id: 4,
    type: "Public",
    title: "Community Meetup",
    status: "90/100",
    image: require("../assets/images/sample-event-2.jpg"),
  },
  {
    id: 5,
    type: "Upcoming",
    title: "Future Leaders Summit",
    status: "60/80",
    image: require("../assets/images/sample-event-1.jpg"),
  },
  // New Public event
  {
    id: 7,
    type: "Public",
    title: "Annual Sports Fest",
    status: "150/200",
    image: require("../assets/images/sample-event-2.jpg"),
  },
  // New Upcoming event
  {
    id: 8,
    type: "Upcoming",
    title: "Music & Arts Expo",
    status: "50/100",
    image: require("../assets/images/sample-event-1.jpg"),
  },
];

const filters = [
  { label: "Public Events", type: "Public" },
  { label: "Upcoming Events", type: "Upcoming" },
];

const EventsSection = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Public");
  const [activePage, setActivePage] = useState(0);
  const cardsPerPage = 3;
  const filteredEvents = eventData.filter(e => e.type === activeFilter);
  const pageCount = Math.ceil(filteredEvents.length / cardsPerPage) || 1;
  const pagedEvents = filteredEvents.slice(
    activePage * cardsPerPage,
    activePage * cardsPerPage + cardsPerPage
  );

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {pagedEvents.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">No events found.</div>
          ) : (
            pagedEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition-transform hover:scale-[1.02] border border-gray-100 relative"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover object-center"
                  draggable={false}
                />
                <div className="flex-1 flex flex-col p-4">
                  <h3 className="text-lg md:text-xl font-bold mb-1 text-[var(--accent-color)] truncate">{event.title}</h3>
                  <span className="text-xs md:text-sm text-gray-500 mb-2">{event.status}</span>
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
        <div className="flex justify-center w-full mt-8">
          {Array.from({ length: pageCount }).map((_, idx) => (
            <button
              key={idx}
              className={`mx-1 w-6 h-2 rounded-full transition-all duration-200 ${idx === activePage
                  ? "bg-[var(--accent-color)]"
                  : "bg-gray-300 hover:bg-[var(--accent-color)]/40"
                }`}
              onClick={() => setActivePage(idx)}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </section>
      <footer className="w-full max-w-6xl mx-auto px-0 mt-16 relative overflow-visible">
        <div className="w-full relative" style={{ height: '140px' }}>
          <svg className="absolute left-0 top-0 w-full h-36" viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,70 C480,210 960,0 1440,140 L1440,140 L0,140 Z" fill="#e5e7eb" />
          </svg>
        </div>
        <div className="w-full bg-[#e5e7eb] rounded-b-2xl shadow-sm border-t border-[var(--border-color)] -mt-2 px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-sm text-[var(--text-muted)]">
          <span>
            © {new Date().getFullYear()} <span className="font-semibold text-[var(--accent-color)]">QRserve</span>. All rights reserved.
          </span>
          <div className="flex gap-4 justify-center mt-2 md:mt-0">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[var(--accent-color)] hover:text-pink-500 transition-colors text-xl"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-[var(--accent-color)] hover:text-blue-400 transition-colors text-xl"><FaTwitter /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[var(--accent-color)] hover:text-blue-600 transition-colors text-xl"><FaFacebookF /></a>
            <a href="mailto:info@qrserve.com" aria-label="Gmail" className="text-[var(--accent-color)] hover:text-red-500 transition-colors text-xl"><SiGmail /></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default EventsSection;
