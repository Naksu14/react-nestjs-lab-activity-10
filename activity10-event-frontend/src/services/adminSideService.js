import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const usersService = {
    getAllUsers: () => axios.get(`${API_URL}/event-users/all`).then((r) => r.data),

    // Aliases for backward compatibility
    getAllOrganizers: () =>
        axios.get(`${API_URL}/event-users/role/organizers`).then((r) => r.data),

    getAllAttendees: () =>
        axios.get(`${API_URL}/event-users/role/attendees`).then((r) => r.data),

    getOrganizersByRole: () =>
        axios.get(`${API_URL}/event-users/role/organizers`).then((r) => r.data),

    getAttendeesByRole: () =>
        axios.get(`${API_URL}/event-users/role/attendees`).then((r) => r.data),

    getOrganizerById: (id) =>
        axios.get(`${API_URL}/event-users/${id}`).then((response) => response.data),

    createOrganizer: (organizerData) =>
        axios.post(`${API_URL}/event-users/create`, organizerData).then((response) => response.data),

    updateOrganizer: (id, organizerData) => {
        const token = localStorage.getItem('authToken');
        return axios
            .patch(`${API_URL}/event-users/update/${id}`, organizerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response.data);
    },

    archiveOrganizer: (id) =>
        axios.patch(`${API_URL}/event-users/archive/${id}`).then((response) => response.data),

    restoreOrganizer: (id) =>
        axios.patch(`${API_URL}/event-users/restore/${id}`).then((response) => response.data),

    getAllArchivedOrganizers: () =>
        axios.get(`${API_URL}/event-users/archived`).then((response) => response.data),
};