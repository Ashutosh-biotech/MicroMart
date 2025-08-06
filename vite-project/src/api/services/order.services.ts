import axios from 'axios';
import { type Order } from '../types/order.types';
import { Routes } from '../config/api-routes';

export const orderService = {
	getAllOrders: async (): Promise<Order[]> => {
		const response = await axios.get(Routes.Orders.list);
		return response.data;
	},

	getOrderById: async (id: string): Promise<Order> => {
		const response = await axios.get(Routes.Orders.byId(id));
		return response.data;
	},

	getOrdersByUserId: async (userId: string): Promise<Order[]> => {
		const response = await axios.get(`${Routes.Orders.list}/user/${userId}`);
		return response.data;
	},

	createOrder: async (order: Order): Promise<Order> => {
		const response = await axios.post(Routes.Orders.list, order);
		return response.data;
	},

	updateOrderStatus: async (id: string, status: string): Promise<Order> => {
		const response = await axios.patch(`${Routes.Orders.list}/${id}/status?status=${status}`);
		return response.data;
	}
};