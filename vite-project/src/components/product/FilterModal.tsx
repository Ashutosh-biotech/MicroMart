import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onApplyFilters: (filters: any) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
	const [priceRange, setPriceRange] = React.useState([0, 10000]);
	const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
	const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
	const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
	const [inStock, setInStock] = React.useState(false);
	const [availableTags, setAvailableTags] = React.useState<string[]>([]);

	const brands = ['ComfortSeating', 'PetComfort', 'TechBrand', 'FashionCo'];
	const ratings = [4, 3, 2, 1];

	React.useEffect(() => {
		if (isOpen) {
			// Load available tags when modal opens
			fetch('/api/products/all-tags')
				.then(res => res.json())
				.then(setAvailableTags)
				.catch(console.error);
		}
	}, [isOpen]);

	const handleApply = () => {
		onApplyFilters({
			priceRange,
			brands: selectedBrands,
			tags: selectedTags,
			rating: selectedRating,
			inStock
		});
		onClose();
	};

	const handleReset = () => {
		setPriceRange([0, 10000]);
		setSelectedBrands([]);
		setSelectedTags([]);
		setSelectedRating(null);
		setInStock(false);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
						onClick={onClose}
					/>
					
					{/* Modal */}
					<motion.div
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 max-h-[80vh] overflow-y-auto"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
							<h2 className="text-lg font-semibold">Filters</h2>
							<button
								onClick={onClose}
								className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
							>
								×
							</button>
						</div>

						<div className="p-4 space-y-6">
							{/* Price Range */}
							<div>
								<h3 className="font-medium mb-3">Price Range</h3>
								<div className="space-y-2">
									<input
										type="range"
										min="0"
										max="10000"
										value={priceRange[1]}
										onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
										className="w-full"
									/>
									<div className="flex justify-between text-sm text-gray-600">
										<span>₹0</span>
										<span>₹{priceRange[1]}</span>
									</div>
								</div>
							</div>

							{/* Brands */}
							<div>
								<h3 className="font-medium mb-3">Brands</h3>
								<div className="space-y-2">
									{brands.map(brand => (
										<label key={brand} className="flex items-center">
											<input
												type="checkbox"
												checked={selectedBrands.includes(brand)}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedBrands([...selectedBrands, brand]);
													} else {
														setSelectedBrands(selectedBrands.filter(b => b !== brand));
													}
												}}
												className="mr-2"
											/>
											<span className="text-sm">{brand}</span>
										</label>
									))}
								</div>
							</div>

							{/* Rating */}
							<div>
								<h3 className="font-medium mb-3">Minimum Rating</h3>
								<div className="space-y-2">
									{ratings.map(rating => (
										<label key={rating} className="flex items-center">
											<input
												type="radio"
												name="rating"
												checked={selectedRating === rating}
												onChange={() => setSelectedRating(rating)}
												className="mr-2"
											/>
											<span className="text-sm flex items-center">
												{rating}+ <span className="text-yellow-400 ml-1">★</span>
											</span>
										</label>
									))}
								</div>
							</div>

							{/* Tags */}
							<div>
								<h3 className="font-medium mb-3">Tags</h3>
								<div className="max-h-32 overflow-y-auto space-y-2">
									{availableTags.slice(0, 10).map(tag => (
										<label key={tag} className="flex items-center">
											<input
												type="checkbox"
												checked={selectedTags.includes(tag)}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedTags([...selectedTags, tag]);
													} else {
														setSelectedTags(selectedTags.filter(t => t !== tag));
													}
												}}
												className="mr-2"
											/>
											<span className="text-sm capitalize">{tag}</span>
										</label>
									))}
								</div>
							</div>

							{/* Stock */}
							<div>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={inStock}
										onChange={(e) => setInStock(e.target.checked)}
										className="mr-2"
									/>
									<span className="text-sm">In Stock Only</span>
								</label>
							</div>
						</div>

						{/* Footer */}
						<div className="flex gap-3 p-4 border-t bg-gray-50">
							<button
								onClick={handleReset}
								className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
							>
								Reset
							</button>
							<button
								onClick={handleApply}
								className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
							>
								Apply Filters
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};