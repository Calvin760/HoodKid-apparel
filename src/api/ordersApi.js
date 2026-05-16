import axios from "axios";

const API_URL = "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

export const fetchAdminOrders = async () => {
    const { data } = await axios.get(`${API_URL}/api/orders/admin`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });

    return data.orders || [];
};

export const updateOrderStatus = async (id, payload) => {
    return axios.put(
        `${API_URL}/api/orders/${id}/status`,
        payload,
        {
            headers: { Authorization: `Bearer ${getToken()}` },
        }
    );
};