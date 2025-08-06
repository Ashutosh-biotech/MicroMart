interface OrderItem {
	productId: string;
	productName: string;
	price: string | number;
	quantity: number;
	subtotal: string | number;
}

interface Order {
	id?: string;
	userId: string;
	items: OrderItem[];
	totalAmount: string | number;
	status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
	shippingAddress: string;
	paymentMethod: string;
	createdAt?: string;
	updatedAt?: string;
}

export type { Order, OrderItem };