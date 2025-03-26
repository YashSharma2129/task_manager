const API_CONFIG = {
    BASE_URL: "http://localhost:8000",
    ENDPOINTS: {
        TASKS: "/tasks"
    }
};

export const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}`;
export default API_CONFIG;