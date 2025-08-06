import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";
import URLS from "../../../utils/URLS";

interface SearchBoxProps {
	categories: string[];
	onSearch?: (query: string, category: string) => void;
	mobile?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
	categories,
	onSearch,
	mobile = false
}) => {
	const [categoryDropdown, setCategoryDropdown] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("All Categories");
	const [search, setSearch] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setCategoryDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
		setCategoryDropdown(false);
	};

	const navigate = useNavigate();

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (onSearch) {
			onSearch(search, selectedCategory);
		} else {
			// Navigate to products page with search parameters
			const params = new URLSearchParams();
			if (search.trim()) {
				params.set('search', search.trim());
			}
			if (selectedCategory !== 'All Categories') {
				params.set('category', selectedCategory);
			}
			navigate(`${URLS.PRODUCTS}?${params.toString()}`);
		}
	};

	const containerClasses = mobile
		? "bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 flex items-center gap-2 w-full"
		: "bg-gray-50 border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 min-w-0 flex-1";

	return (
		<form className={containerClasses} onSubmit={handleSearch}>
			{/* Category Selector */}
			<div className="relative flex-shrink-0" ref={dropdownRef}>
				<button
					type="button"
					className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded px-2 py-1 cursor-pointer"
					onClick={() => setCategoryDropdown(!categoryDropdown)}
					aria-expanded={categoryDropdown}
					aria-haspopup="listbox"
				>
					<span className={`whitespace-nowrap text-sm ${mobile ? 'max-w-[80px] truncate' : 'max-w-[120px] truncate'}`}>
						{selectedCategory}
					</span>
					<motion.span
						animate={{ rotate: categoryDropdown ? 180 : 0 }}
						transition={{ duration: 0.2 }}
					>
						<FaCaretDown className="text-xs" />
					</motion.span>
				</button>

				<AnimatePresence>
					{categoryDropdown && (
						<motion.ul
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-48 max-h-60 overflow-y-auto"
							role="listbox"
						>
							{categories.map((category, index) => (
								<li key={index}>
									<button
										type="button"
										className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${selectedCategory === category
												? "bg-orange-50 text-orange-600 font-medium"
												: "text-gray-700"
											}`}
										onClick={() => handleCategorySelect(category)}
										role="option"
										aria-selected={selectedCategory === category}
									>
										{category}
									</button>
								</li>
							))}
						</motion.ul>
					)}
				</AnimatePresence>
			</div>

			{/* Divider */}
			<div className="w-px h-6 bg-gray-300 flex-shrink-0" />

			{/* Search Input */}
			<input
				type="text"
				placeholder={`Search in ${selectedCategory}`}
				className="flex-1 min-w-0 outline-none bg-transparent text-gray-700 placeholder-gray-500 text-sm"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				aria-label="Search products"
			/>

			{/* Search Button */}
			<button
				type="submit"
				className="flex-shrink-0 p-2 text-gray-600 hover:text-white hover:bg-blue-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
				aria-label="Search"
			>
				<LuSearch className="text-lg" />
			</button>
		</form>
	);
};
