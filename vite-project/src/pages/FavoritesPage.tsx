import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import { type Product } from '../api/types/product.types';
import { productService } from '../api/services/product.services';
import { wishlistService } from '../api/services/wishlist.services';
import { ProductCard } from '../components/product/ProductCard';
import { FaHeart } from 'react-icons/fa';

export const FavoritesPage: React.FC = () => {
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (isAuthenticated) {
			loadFavorites();
		} else {
			setLoading(false);
		}
	}, [isAuthenticated]);

	const loadFavorites = async () => {
		try {
			const wishlistIds = await wishlistService.getWishlist();
			if (wishlistIds.length > 0) {
				const products = await Promise.all(
					wishlistIds.map(id => productService.getProductById(id))
				);
				setFavoriteProducts(products.filter(Boolean));
			}
		} catch (error) {
			console.error('Failed to load favorites:', error);
		} finally {
			setLoading(false);
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<FaHeart className="mx-auto text-gray-300 mb-4" size={64} />
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
					<p className="text-gray-600">You need to be logged in to view your favorites.</p>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading your favorites...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="mb-8">
					<div className="flex items-center space-x-3 mb-2">
						<FaHeart className="text-red-500" size={32} />
						<h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
					</div>
					<p className="text-gray-600">
						{favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} in your wishlist
					</p>
				</div>

				{favoriteProducts.length === 0 ? (
					<div className="text-center py-16">
						<FaHeart className="mx-auto text-gray-300 mb-4" size={64} />
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h2>
						<p className="text-gray-600 mb-6">
							Start adding products to your wishlist by clicking the heart icon on any product.
						</p>
						<a
							href="/products"
							className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
						>
							Browse Products
						</a>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{favoriteProducts.map(product => (
							<ProductCard key={product.id} product={product} onFavoriteChange={loadFavorites} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};