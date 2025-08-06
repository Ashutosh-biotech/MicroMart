import { useEffect, useState } from 'react';
import { type Order } from '../api/types/order.types';
import { orderService } from '../api/services/order.services';

export const OrdersPage = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		orderService.getAllOrders()
			.then(setOrders)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'PENDING': return 'text-yellow-600 bg-yellow-100';
			case 'CONFIRMED': return 'text-blue-600 bg-blue-100';
			case 'SHIPPED': return 'text-purple-600 bg-purple-100';
			case 'DELIVERED': return 'text-green-600 bg-green-100';
			case 'CANCELLED': return 'text-red-600 bg-red-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	};

	if (loading) {
		return <div className="flex justify-center items-center min-h-screen">Loading orders...</div>;
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
			
			{orders.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-500 text-lg">No orders found</div>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map(order => (
						<div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="flex justify-between items-start mb-4">
								<div>
									<h3 className="text-lg font-semibold text-gray-900">Order #{order.id?.slice(-8)}</h3>
									<p className="text-sm text-gray-600">
										{order.createdAt && new Date(order.createdAt).toLocaleDateString()}
									</p>
								</div>
								<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'PENDING')}`}>
									{order.status}
								</span>
							</div>
							
							<div className="space-y-2 mb-4">
								{order.items.map((item, index) => (
									<div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
										<div>
											<span className="font-medium">{item.productName}</span>
											<span className="text-gray-600 ml-2">x{item.quantity}</span>
										</div>
										<span className="font-medium">₹{item.subtotal}</span>
									</div>
								))}
							</div>
							
							<div className="flex justify-between items-center pt-4 border-t border-gray-200">
								<div className="text-sm text-gray-600">
									<p>Payment: {order.paymentMethod}</p>
									<p className="truncate max-w-xs">Address: {order.shippingAddress}</p>
								</div>
								<div className="text-xl font-bold text-gray-900">
									Total: ₹{order.totalAmount}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};