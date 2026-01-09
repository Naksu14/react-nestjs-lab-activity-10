import React from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
const AboutEvent = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white text-left">
            <Header />

            <section className="pt-[96px] max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-gray-100 h-[420px]">
                    <img
                        src={require("../../../assets/images/event-details.png")}
                        alt="Event"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col items-center self-start">

                    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden w-full">

                        <div className="bg-[var(--accent-color)] px-5 py-3">
                            <p className="text-sm font-semibold text-white">
                                29 days · 8h · 42m · 59s
                            </p>
                        </div>
                        <div className="p-6 flex flex-col space-y-5 text-left">
                            <span className="text-sm font-semibold uppercase text-[var(--accent-color)]">
                                Event Title
                            </span>
                            <h1 className="text-2xl font-bold leading-snug">
                                Jonel Nuezca Memorial Conference
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-2 py-1 rounded font-semibold">Capacity: 180/200</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">Open</span>
                            </div>
                            <p className="text-base text-gray-500">
                                Oct 19, 2023 – Oct 22, 2023
                            </p>
                            <p className="text-base font-medium">
                                Metro Manila, Philippines
                            </p>
                            <button className="mt-3 w-full bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white py-3 rounded-lg font-semibold text-base transition">
                                Register Now
                            </button>
                            <button className="mt-6 px-6 py-2 rounded bg-gray-200 text-[var(--accent-color)] font-semibold text-base shadow hover:bg-gray-300 transition" onClick={() => navigate(-1)} > Return to Events </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 text-center">
                        Hosted by{" "}
                        <span className="font-semibold text-[var(--accent-color)]">
                            Giga Nigga
                        </span>
                    </p>


                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 mt-2">
                <h2 className="text-xl font-bold mb-4">About event</h2>

                <p className="text-base text-gray-600 leading-relaxed max-w-4xl">
                    The term "metaverse" originated in the 1992 science fiction novel
                    Snow Crash as a portmanteau of "meta" and "universe." Metaverse
                    development is often linked to advancing virtual reality technology
                    due to increasing demands for immersion. Recent interest in metaverse
                    development is influenced by Web3, a concept for a decentralized...
                </p>

                <button className="mt-4 text-[var(--accent-color)] font-semibold text-base">
                    Read More
                </button>
            </section>
        </div>
    );
}

export default AboutEvent;
