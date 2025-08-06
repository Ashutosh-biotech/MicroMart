import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSmartCart } from '../redux/hooks/useSmartCart';
import { usePageTitle } from '../redux/hooks/usePageTitle';
import { loadCartFromBackend } from '../redux/slices/cartSlice';
import { type RootState } from '../redux/store';
import URLS from '../utils/URLS';

export const CartPage: React.FC = () => {
	usePageTitle('Shopping Cart');
	const dispatch = useDispatch();
	const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
	const { items, updateQuantity, removeFromCart } = useSmartCart();
	
	useEffect(() => {
		if (isAuthenticated && token) {
			dispatch(loadCartFromBackend() as any);
		}
	}, [dispatch, isAuthenticated, token]);
	
	const totalPrice = items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

	if (items.length === 0) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
				<p className="text-gray-600 mb-6">Add some products to get started!</p>
				<Link 
					to={URLS.PRODUCTS}
					className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
				>
					Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>
			
			<div className="space-y-4 mb-8">
				{items.map(item => (
					<div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
						<img
							src={item.primaryImage?.startsWith('/api/') ? `http://localhost:8080${item.primaryImage}` : item.primaryImage}
							alt={item.name}
							className="w-20 h-20 object-cover rounded"
						/>
						<div className="flex-1">
							<h3 className="font-medium">{item.name}</h3>
							<p className="text-blue-600 font-semibold">₹{item.price}</p>
							<div className="flex items-center space-x-3 mt-2">
								<button
									onClick={() => updateQuantity(item.id, item.quantity - 1)}
									className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer"
								>
									-
								</button>
								<span>{item.quantity}</span>
								<button
									onClick={() => updateQuantity(item.id, item.quantity + 1)}
									className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer"
								>
									+
								</button>
								<button
									onClick={() => removeFromCart(item.id)}
									className="px-3 py-1 border border-red-500 text-red-500 text-sm rounded hover:bg-red-50 ml-4 cursor-pointer"
								>
									Remove
								</button>
							</div>
						</div>
						<div className="text-right">
							<p className="font-semibold">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
						</div>
					</div>
				))}
			</div>

			<div className="border-t pt-4">
				<div className="flex justify-between items-center mb-4">
					<span className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</span>
				</div>
				<button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-lg cursor-pointer">
					Proceed to Checkout
				</button>
			</div>
		</div>
	);
};