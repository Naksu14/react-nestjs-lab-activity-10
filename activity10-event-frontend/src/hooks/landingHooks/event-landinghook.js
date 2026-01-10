import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublishedAndCompletedEvents } from "../../services/eventsService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const buildImageUrl = (path) => {
	if (!path) return null;
	const base = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
	return `${base}${path}`;
};

const normalizeEvents = (events) => {
	if (!Array.isArray(events)) return [];

	return events.map((event) => {
		const normalizedStatus = (event?.status || "").toLowerCase();
		return {
			...event,
			status: normalizedStatus,
			statusLabel:
				normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1),
			title: event?.title_event || event?.title || "Untitled Event",
			startDate: event?.start_datetime ? new Date(event.start_datetime) : null,
			endDate: event?.end_datetime ? new Date(event.end_datetime) : null,
			imageUrl: buildImageUrl(event?.eventImage),
		};
	});
};

const useLandingEvents = () => {
	const {
		data,
		isLoading,
		isError,
		error: queryError,
	} = useQuery({
		queryKey: ["landing-events"],
		queryFn: async () => {
			const events = await getPublishedAndCompletedEvents();
			return normalizeEvents(events);
		},
		staleTime: 60_000,
		refetchOnWindowFocus: false,
		retry: 1,
		meta: { feature: "landing-events" },
	});

	const sortedEvents = useMemo(() => {
		const safeEvents = Array.isArray(data) ? data : [];
		return [...safeEvents].sort((a, b) => {
			const aTime = a?.startDate?.getTime?.() ?? 0;
			const bTime = b?.startDate?.getTime?.() ?? 0;
			return aTime - bTime;
		});
	}, [data]);

	const errorMessage = isError ? "Unable to load events right now." : null;
	if (isError) {
		console.error("Failed to load landing events", queryError);
	}

	return { events: sortedEvents, loading: isLoading, error: errorMessage };
};

export default useLandingEvents;
