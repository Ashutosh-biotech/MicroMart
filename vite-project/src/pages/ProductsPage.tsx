import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { type Product } from '../api/types/product.types';
import { productService } from '../api/services/product.services';

export const ProductsPage: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams();
	const [pageTitle, setPageTitle] = useState('All Products');
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const pageSize = 12;

	useEffect(() => {
		const categoryParam = searchParams.get('category');
		const searchParam = searchParams.get('search');
		
		const page = parseInt(searchParams.get('page') || '0');
		setCurrentPage(page);

		if (searchParam) {
			// Search products
			const searchTitle = categoryParam && categoryParam !== 'All Categories' 
				? `Search Results for "${searchParam}" in ${categoryParam}`
				: `Search Results for "${searchParam}"`;
			setPageTitle(searchTitle);
			productService.searchProducts(searchParam, page, pageSize, categoryParam || undefined)
				.then(response => {
					// Handle both paginated and non-paginated responses
					if (response.content) {
						setProducts(response.content);
						setTotalPages(response.totalPages || 1);
						setTotalElements(response.totalElements || response.content.length);
					} else {
						// Non-paginated response (array)
						setProducts(response);
						setTotalPages(1);
						setTotalElements(response.length);
					}
				})
				.catch(console.error)
				.finally(() => setLoading(false));
		} else if (categoryParam && categoryParam !== 'All Categories') {
			// Get products by category
			const categoryMap: Record<string, string> = {
				'Clothes & Fashion': 'Clothes',
				'Electronics': 'Electronics',
				'Books': 'Books',
				'Pets': 'Pet Supplies',
				'Furniture': 'Furniture'
			};
			const backendCategory = categoryMap[categoryParam] || categoryParam;
			setPageTitle(`${categoryParam} Products`);
			productService.getProductsByCategory(backendCategory, page, pageSize)
				.then(response => {
					setProducts(response.content);
					setTotalPages(response.page?.totalPages || response.totalPages || 1);
					setTotalElements(response.page?.totalElements || response.totalElements || response.content.length);
				})
				.catch(console.error)
				.finally(() => setLoading(false));
		} else {
			// Get all products
			setPageTitle('All Products');
			productService.getAllProducts(page, pageSize)
				.then(response => {
					setProducts(response.content);
					setTotalPages(response.page?.totalPages || response.totalPages || 1);
					setTotalElements(response.page?.totalElements || response.totalElements || response.content.length);
				})
				.catch(console.error)
				.finally(() => setLoading(false));
		}
	}, [searchParams]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-xl">Loading products...</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="mb-8">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
					<div className="text-sm text-gray-600">
						Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} products
					</div>
				</div>
			</div>

			{products.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-500 text-lg">No products found</div>
					<div className="text-gray-400 text-sm mt-2">Try a different search or category</div>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
						{products.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
					
					{totalPages > 1 && (
						<div className="flex justify-center items-center gap-2">
							<button
								onClick={() => {
									const params = new URLSearchParams(searchParams);
									params.set('page', (currentPage - 1).toString());
									setSearchParams(params);
								}}
								disabled={currentPage === 0}
								className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								Previous
							</button>
							
							<span className="px-4 py-2">
								Page {currentPage + 1} of {totalPages}
							</span>
							
							<button
								onClick={() => {
									const params = new URLSearchParams(searchParams);
									params.set('page', (currentPage + 1).toString());
									setSearchParams(params);
								}}
								disabled={currentPage >= totalPages - 1}
								className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};