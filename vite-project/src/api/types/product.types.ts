interface Product {
	id: string;
	name: string;
	description: string;
	price: string | number;
	category: string;
	brand: string;
	stockQuantity: number;
	sku: string;
	primaryImage: string;
	additionalImages: string[];
	attributes: Record<string, any>;
	rating?: number;
	reviewCount?: number;
	tags?: string[];
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export type { Product };