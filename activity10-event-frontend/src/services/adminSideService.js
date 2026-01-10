import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const usersService = {
    getAllOrganizers: () => {
        return axios.get(`${API_URL}/event-users/all`).then(response => response.data);
    },

    getOrganizerById: (id) => {
        return axios.get(`${API_URL}/event-users/${id}`).then(response => response.data);
    },

    createOrganizer: (organizerData) => {
        return axios.post(`${API_URL}/event-users/create`, organizerData).then(response => response.data);
    },

    updateOrganizer: (id, organizerData) => {
        const token = localStorage.getItem('authToken');
        return axios.patch(`${API_URL}/event-users/update/${id}`, organizerData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(response => response.data);
    },

    archiveOrganizer: (id) => {
        return axios.patch(`${API_URL}/event-users/archive/${id}`).then(response => response.data);
    },

    restoreOrganizer: (id) => {
        return axios.patch(`${API_URL}/event-users/restore/${id}`).then(response => response.data);
    },

    getAllArchivedOrganizers: () => {
        return axios.get(`${API_URL}/event-users/archived`).then(response => response.data);
    }
}