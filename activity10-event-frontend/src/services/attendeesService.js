import { api } from "./eventsService";

const getAuthHeader = () => {
	const token = localStorage.getItem("authToken");
	return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerForEvent = async ({ eventId, userId }) => {
	if (!eventId) {
		throw new Error("Missing event id");
	}
	if (!userId) {
		throw new Error("Missing user id");
	}

	const payload = {
		event_id: eventId,
		user_id: userId,
	};

	try {
		const { data } = await api.post("/event-registrations", payload, {
			headers: getAuthHeader(),
		});
		return data;
	} catch (err) {
		const message = err?.response?.data?.message || "Unable to register for this event";
		throw new Error(Array.isArray(message) ? message.join(", ") : message);
	}
};

export const getRegistrationCount = async (eventId) => {
	if (!eventId) {
		throw new Error("Missing event id");
	}

	const { data } = await api.get("/event-registrations", {
		headers: getAuthHeader(),
	});

	if (!Array.isArray(data)) {
		return 0;
	}

	return data.filter((reg) => {
		const matchesEvent = Number(reg.event_id) === Number(eventId);
		const isRegistered = (reg.registration_status || "").toLowerCase() === "registered";
		return matchesEvent && isRegistered;
	}).length;
};

export const getAllRegistrations = async () => {
	const { data } = await api.get("/event-registrations", {
		headers: getAuthHeader(),
	});

	if (!Array.isArray(data)) {
		return [];
	}

	return data;
};

export const getUserRegistrationForEvent = async (eventId, userId) => {
	if (!eventId || !userId) {
		throw new Error("Missing event id or user id");
	}

	const { data } = await api.get(`/event-registrations`, {
		headers: getAuthHeader(),
	});

	if (!Array.isArray(data)) {
		return null;
	}

	const regs = data.filter(
		(reg) => Number(reg.event_id) === Number(eventId) && Number(reg.user_id) === Number(userId),
	);

	return regs.find((reg) => (reg.registration_status || "").toLowerCase() === "registered") || null;
};

export const getTicketsForUser = async (userId) => {
	if (!userId) {
		throw new Error("Missing user id");
	}

	const { data } = await api.get("/event-tickets", {
		headers: getAuthHeader(),
	});

	if (!Array.isArray(data)) {
		return [];
	}

	return data.filter((ticket) => {
		const regUserId = ticket.registration?.user_id ?? ticket.registration?.user?.id;
		return Number(regUserId) === Number(userId);
	});
};

export const cancelRegistration = async (registrationId) => {
	if (!registrationId) {
		throw new Error("Missing registration id");
	}

	await api.patch(
		`/event-registrations/${registrationId}`,
		{ registration_status: "cancelled" },
		{ headers: getAuthHeader() },
	);
};
