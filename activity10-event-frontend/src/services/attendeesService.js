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

	return data.filter((reg) => Number(reg.event_id) === Number(eventId)).length;
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

	return data.find(
		(reg) => Number(reg.event_id) === Number(eventId) && Number(reg.user_id) === Number(userId),
	) || null;
};
