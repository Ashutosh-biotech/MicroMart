import axios from 'axios';
import { type Product } from '../types/product.types.js';
import { Routes } from '../config/api-routes';

export const productService = {
	getAllProducts: async (page = 0, size = 12): Promise<any> => {
		const response = await axios.get(`${Routes.Products.list}?page=${page}&size=${size}`);
		return response.data;
	},

	getProductsByTags: async (tags: string[], page = 0, size = 12): Promise<any> => {
		const tagParams = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
		const response = await axios.get(`${Routes.Products.list}/tags?${tagParams}&page=${page}&size=${size}`);
		return response.data;
	},

	getAllTags: async (): Promise<string[]> => {
		const response = await axios.get(`${Routes.Products.list}/all-tags`);
		return response.data;
	},

	getProductById: async (id: string): Promise<Product> => {
		const response = await axios.get(Routes.Products.byId(id));
		return response.data;
	},

	getProductsByCategory: async (category: string, page = 0, size = 12): Promise<any> => {
		const response = await axios.get(`${Routes.Products.list}/category/${category}?page=${page}&size=${size}`);
		return response.data;
	},

	searchProducts: async (name: string, page = 0, size = 12, category?: string): Promise<any> => {
		let url = `${Routes.Products.search}?name=${name}&page=${page}&size=${size}`;
		if (category && category !== 'All Categories') {
			url += `&category=${encodeURIComponent(category)}`;
		}
		const response = await axios.get(url);
		return response.data;
	},

	getRelatedProducts: async (id: string, limit = 8): Promise<Product[]> => {
		const response = await axios.get(`${Routes.Products.byId(id)}/related?limit=${limit}`);
		return response.data;
	},

	filterProducts: async (filters: any, page = 0, size = 12): Promise<any> => {
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString()
		});
		
		if (filters.priceRange && filters.priceRange[1] < 10000) {
			params.append('maxPrice', filters.priceRange[1].toString());
		}
		if (filters.brands && filters.brands.length > 0) {
			filters.brands.forEach((brand: string) => params.append('brands', brand));
		}
		if (filters.rating) {
			params.append('minRating', filters.rating.toString());
		}
		if (filters.tags && filters.tags.length > 0) {
			filters.tags.forEach((tag: string) => params.append('tags', tag));
		}
		if (filters.inStock) {
			params.append('inStock', 'true');
		}
		
		const response = await axios.get(`${Routes.Products.list}/filter?${params}`);
		return response.data;
	}
};