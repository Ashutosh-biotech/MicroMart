import axios from 'axios';
import { Routes } from '../config/api-routes';

export interface CartItem {
	productId: string;
	productName: string;
	price: string;
	quantity: number;
	primaryImage?: string;
}

export interface Cart {
	id: string;
	userId: string;
	items: CartItem[];
	createdAt: string;
	updatedAt: string;
}

export class CartService {
	private getAuthHeaders() {
		const token = localStorage.getItem('token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	async getCart(): Promise<Cart> {
		const response = await axios.post(Routes.Cart.get(), {}, {
			headers: this.getAuthHeaders()
		});
		return response.data;
	}

	async addToCart(item: CartItem): Promise<Cart> {
		try {
			const response = await axios.post(Routes.Cart.add(), item, {
				headers: this.getAuthHeaders()
			});
			return response.data;
		} catch (error) {
			console.error('API: Error', error);
			throw error;
		}
	}

	async updateCartItem(productId: string, quantity: number): Promise<Cart> {
		const response = await axios.put(Routes.Cart.update(productId), null, {
			params: { quantity },
			headers: this.getAuthHeaders()
		});
		return response.data;
	}

	async removeFromCart(productId: string): Promise<Cart> {
		const response = await axios.delete(Routes.Cart.remove(productId), {
			headers: this.getAuthHeaders()
		});
		return response.data;
	}

	async clearCart(): Promise<void> {
		await axios.delete(Routes.Cart.clear(), {
			headers: this.getAuthHeaders()
		});
	}

	async syncCart(items: CartItem[]): Promise<Cart> {
		const response = await axios.post(Routes.Cart.sync(), items, {
			headers: this.getAuthHeaders()
		});
		return response.data;
	}
}

export const cartService = new CartService();