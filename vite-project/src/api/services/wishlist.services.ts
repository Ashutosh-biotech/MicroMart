import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/auth';

export const wishlistService = {
	getWishlist: async (): Promise<string[]> => {
		const token = localStorage.getItem('token');
		const response = await axios.get(`${API_BASE}/wishlist`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	},

	addToWishlist: async (productId: string): Promise<void> => {
		const token = localStorage.getItem('token');
		await axios.post(`${API_BASE}/wishlist/${productId}`, {}, {
			headers: { Authorization: `Bearer ${token}` }
		});
	},

	removeFromWishlist: async (productId: string): Promise<void> => {
		const token = localStorage.getItem('token');
		await axios.delete(`${API_BASE}/wishlist/${productId}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}
};