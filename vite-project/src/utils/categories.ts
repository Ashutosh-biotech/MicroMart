export const categoryTitles = [
	'Clothes & Fashion',
	'Electronics', 
	'Books',
	'Pets',
	'Furniture',
	'Shoes',
	'Packaged Food',
	'Accessories'
];

export const getCategoryTitles = (): string[] => {
	return ['All Categories', ...categoryTitles];
};