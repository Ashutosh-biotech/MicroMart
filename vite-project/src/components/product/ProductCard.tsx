import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { type Product } from '../../api/types/product.types.ts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import { viewedProductsUtil } from '../../utils/viewedProducts';
import { favoritesUtil } from '../../utils/favorites';
import { StarRating } from '../common/StarRating';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import URLS from '../../utils/URLS';

interface ProductCardProps {
	product: Product;
	onFavoriteChange?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onFavoriteChange }) => {
	const navigate = useNavigate();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const initializeFavorites = async () => {
			if (isAuthenticated) {
				await favoritesUtil.initializeFavorites();
			}
			setIsFavorite(favoritesUtil.isFavorite(product.id));
		};
		initializeFavorites();
	}, [isAuthenticated, product.id]);

	const handleClick = () => {
		navigate(`${URLS.PRODUCT}/${product.id}`);
	};

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!isAuthenticated) {
			navigate('/signin');
			return;
		}
		try {
			const newFavoriteState = await favoritesUtil.toggleFavorite(product.id);
			setIsFavorite(newFavoriteState);
			onFavoriteChange?.();
		} catch (error) {
			console.error('Failed to toggle favorite:', error);
		}
	};

	const isViewed = viewedProductsUtil.isProductViewed(product.id);

	return (
		<motion.div
			className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
			onClick={handleClick}
			whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<div className="aspect-square overflow-hidden relative">
				<img
					src={product.primaryImage?.startsWith('/api/') ? `http://localhost:8080${product.primaryImage}` : product.primaryImage}
					alt={product.name}
					className="w-full h-full object-cover"
				/>
				{isAuthenticated && (
					<button
						onClick={handleFavoriteClick}
						className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm cursor-pointer"
					>
						{isFavorite ? (
							<FaHeart className="text-red-500" size={16} />
						) : (
							<FaRegHeart className="text-gray-600 hover:text-red-500" size={16} />
						)}
					</button>
				)}
			</div>
			<div className="p-4">
				<div className="flex justify-between items-start mb-1">
					<h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{product.name}</h3>
					{isViewed && (
						<span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
							Viewed
						</span>
					)}
				</div>
				<p className="text-sm text-gray-600 mb-2">{product.brand}</p>
				{product.rating && (
					<div className="mb-2">
						<StarRating 
							rating={product.rating} 
							size="sm" 
							showCount 
							reviewCount={product.reviewCount} 
						/>
					</div>
				)}
				<div className="flex justify-between items-center">
					<span className="text-lg font-bold text-blue-600">₹{product.price}</span>
					<span className="text-xs text-gray-500">
						{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
					</span>
				</div>
			</div>
		</motion.div>
	);
};