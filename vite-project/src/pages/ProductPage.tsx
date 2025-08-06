import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import { type Product } from '../api/types/product.types';
import { productService } from '../api/services/product.services';
import { viewedProductsUtil } from '../utils/viewedProducts';
import { favoritesUtil } from '../utils/favorites';
import { StarRating } from '../components/common/StarRating';
import { useSmartCart } from '../redux/hooks/useSmartCart';
import { ProductCard } from '../components/product/ProductCard';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export const ProductPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { addToCart } = useSmartCart();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAllDetails, setShowAllDetails] = useState(false);
	const [addingToCart, setAddingToCart] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		if (id) {
			const loadData = async () => {
				try {
					const [product, related] = await Promise.all([
						productService.getProductById(id),
						productService.getRelatedProducts(id, 8)
					]);
					
					setProduct(product);
					setRelatedProducts(related);
					
					// Initialize favorites from backend if authenticated
					if (isAuthenticated) {
						await favoritesUtil.initializeFavorites();
					}
					setIsFavorite(favoritesUtil.isFavorite(id));
					
					// Mark product as viewed
					viewedProductsUtil.addViewedProduct(id);
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			};
			
			loadData();
		}
	}, [id, isAuthenticated]);

	const handleFavoriteClick = async () => {
		if (!isAuthenticated) {
			navigate('/signin');
			return;
		}
		if (id) {
			try {
				const newFavoriteState = await favoritesUtil.toggleFavorite(id);
				setIsFavorite(newFavoriteState);
			} catch (error) {
				console.error('Failed to toggle favorite:', error);
			}
		}
	};

	if (loading) return <div className="flex justify-center p-8">Loading...</div>;
	if (!product) return <div className="flex justify-center p-8">Product not found</div>;

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="space-y-4">
					<img
						src={product.primaryImage?.startsWith('/api/') ? `http://localhost:8080${product.primaryImage}` : product.primaryImage}
						alt={product.name}
						className="w-full rounded-lg"
					/>
					{product.additionalImages.length > 0 && (
						<div className="grid grid-cols-4 gap-2">
							{product.additionalImages.map((img, idx) => (
								<img 
									key={idx} 
									src={img?.startsWith('/api/') ? `http://localhost:8080${img}` : img} 
									alt="" 
									className="w-full aspect-square object-cover rounded" 
								/>
							))}
						</div>
					)}
				</div>
				<div className="space-y-6">
					<div>
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
								<p className="text-lg text-gray-600 mt-2">{product.brand}</p>
							</div>
							{isAuthenticated && (
								<button
									onClick={handleFavoriteClick}
									className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
								>
									{isFavorite ? (
										<FaHeart className="text-red-500" size={24} />
									) : (
										<FaRegHeart className="text-gray-600 hover:text-red-500" size={24} />
									)}
								</button>
							)}
						</div>
					</div>
					<div className="text-3xl font-bold text-blue-600">₹{product.price}</div>
					{product.rating && (
						<div className="my-4">
							<StarRating 
								rating={product.rating} 
								size="lg" 
								showCount 
								reviewCount={product.reviewCount} 
							/>
						</div>
					)}
					<p className="text-gray-700">{product.description}</p>
					<div className="space-y-2">
						<p className="text-sm"><span className="font-semibold">Category:</span> {product.category}</p>
						<p className="text-sm"><span className="font-semibold">SKU:</span> {product.sku}</p>
						<p className="text-sm">
							<span className="font-semibold">Stock:</span> 
							<span className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
								{product.stockQuantity > 0 ? ` ${product.stockQuantity} available` : ' Out of stock'}
							</span>
						</p>
					</div>
					
					{/* Product Attributes */}
					{product.attributes && Object.keys(product.attributes).length > 0 && (
						<div className="border-t pt-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
							<div className="space-y-3">
								{Object.entries(product.attributes).slice(0, 2).map(([key, value]) => (
									<div key={key} className="flex justify-between py-2 border-b border-gray-100">
										<span className="font-medium text-gray-600 capitalize">
											{key.replace(/_/g, ' ')}
										</span>
										<span className="text-gray-900">
											{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
										</span>
									</div>
								))}
								{Object.keys(product.attributes).length > 2 && (
									<button
										onClick={() => setShowAllDetails(true)}
										className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
									>
										All product details &nbsp;&nbsp;&gt;&gt;
									</button>
								)}
							</div>
						</div>
					)}
					
					{/* Details Popup */}
					{showAllDetails && (
						<div className="fixed inset-0 backdrop-blur-sm mb-0 bg-[#00000075] flex items-center justify-center z-50" onClick={() => setShowAllDetails(false)}>
							<div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto border-2 " onClick={(e) => e.stopPropagation()}>
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-xl font-semibold text-gray-900">All Product Details</h3>
									<button
										onClick={() => setShowAllDetails(false)}
										className="text-gray-500 hover:text-gray-700 text-2xl"
									>
										×
									</button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{Object.entries(product.attributes).map(([key, value]) => (
										<div key={key} className="flex justify-between py-2 border-b border-gray-100">
											<span className="font-medium text-gray-600 capitalize">
												{key.replace(/_/g, ' ')}
											</span>
											<span className="text-gray-900">
												{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
					<button 
						className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer flex items-center justify-center"
						disabled={product.stockQuantity === 0 || addingToCart}
						onClick={async () => {
							setAddingToCart(true);
							try {
								await addToCart(product);
							} finally {
								setAddingToCart(false);
							}
						}}
					>
						{addingToCart ? (
							<>
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Adding...
							</>
						) : (
							'Add to Cart'
						)}
					</button>
				</div>
			</div>
			
			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<div className="mt-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{relatedProducts.map(relatedProduct => (
							<ProductCard key={relatedProduct.id} product={relatedProduct} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};