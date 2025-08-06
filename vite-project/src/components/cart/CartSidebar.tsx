import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeCart } from '../../redux/slices/cartSlice';
import { useSmartCart } from '../../redux/hooks/useSmartCart';
import URLS from '../../utils/URLS';

export const CartSidebar: React.FC = () => {
	const dispatch = useDispatch();
	const { items, isOpen, updateQuantity, removeFromCart } = useSmartCart();

	const totalPrice = items.reduce((total, item) => {
		const price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price) || 0;
		return total + (price * item.quantity);
	}, 0);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 backdrop-blur-md bg-[#00000045] bg-opacity-50 z-40"
						onClick={() => dispatch(closeCart())}
					/>
					
					{/* Sidebar */}
					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b">
							<h2 className="text-lg font-semibold">Shopping Cart</h2>
							<button
								onClick={() => dispatch(closeCart())}
								className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
							>
								×
							</button>
						</div>

						{/* Cart Items */}
						<div className="flex-1 overflow-y-auto p-4">
							{items.length === 0 ? (
								<div className="text-center text-gray-500 mt-8">
									Your cart is empty
								</div>
							) : (
								<div className="space-y-4">
									{items.map(item => (
										<div key={item.id} className="flex items-center space-x-3 border-b pb-4">
											<img
												src={item.primaryImage?.startsWith('/api/') ? `http://localhost:8080${item.primaryImage}` : item.primaryImage || '/placeholder.jpg'}
												alt={item.name || 'Product'}
												className="w-16 h-16 object-cover rounded"
												onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
											/>
											<div className="flex-1">
												<h3 className="font-medium text-sm">{item.name || 'Unknown Product'}</h3>
												<p className="text-blue-600 font-semibold">₹{Number(item.price).toFixed(2)}</p>
												<div className="flex items-center space-x-2 mt-2">
													<button
														onClick={() => updateQuantity(item.id, item.quantity - 1)}
														className="w-6 h-6 rounded-full border flex items-center justify-center text-sm cursor-pointer"
													>
														-
													</button>
													<span className="text-sm">{item.quantity}</span>
													<button
														onClick={() => updateQuantity(item.id, item.quantity + 1)}
														className="w-6 h-6 rounded-full border flex items-center justify-center text-sm cursor-pointer"
													>
														+
													</button>
													<button
														onClick={() => removeFromCart(item.id)}
														className="px-2 py-1 border border-red-500 text-red-500 text-xs rounded hover:bg-red-50 ml-2 cursor-pointer"
													>
														Remove
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Footer */}
						{items.length > 0 && (
							<div className="border-t p-4 space-y-3">
								<div className="flex justify-between items-center">
									<span className="font-semibold">Total: ₹{totalPrice.toFixed(2)}</span>
								</div>
								<Link
									to={URLS.CART}
									onClick={() => dispatch(closeCart())}
									className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 block text-center"
								>
									View Cart
								</Link>
								<button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
									Checkout
								</button>
							</div>
						)}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};