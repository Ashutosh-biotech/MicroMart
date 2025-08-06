import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Card } from '../common/Card';

interface Category {
	id: string;
	icon: React.ReactNode;
	title: string;
	description?: string;
}

interface ShowCategoriesProps {
	categories: Category[];
	title?: string;
	className?: string;
	onCardClick?: (category: string) => void;
}

export const ShowCategories: React.FC<ShowCategoriesProps> = ({
	categories,
	title = "Category",
	className = '',
	onCardClick
}) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);


	const checkScrollButtons = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
		}
	};

	const getCardWidth = () => {
		if (window.innerWidth < 640) return 160; // Mobile: 144px + 16px gap
		if (window.innerWidth < 768) return 176; // SM: 160px + 16px gap  
		if (window.innerWidth < 1024) return 192; // MD: 176px + 16px gap
		return 208; // LG+: 192px + 16px gap
	};

	const getScrollAmount = () => {
		if (window.innerWidth < 640) return 2; // Mobile: scroll 2 cards
		if (window.innerWidth < 768) return 2; // SM: scroll 2 cards
		return 3; // MD+: scroll 3 cards
	};

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const cardWidth = getCardWidth();
			const scrollAmount = getScrollAmount();
			scrollContainerRef.current.scrollBy({
				left: -cardWidth * scrollAmount,
				behavior: 'smooth'
			});
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const cardWidth = getCardWidth();
			const scrollAmount = getScrollAmount();
			scrollContainerRef.current.scrollBy({
				left: cardWidth * scrollAmount,
				behavior: 'smooth'
			});
		}
	};

	return (
		<div className={`w-full py-4 sm:py-6 ${className}`}>
			{/* Header with title and arrow buttons */}
			<div className="flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-4">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>

				<div className="flex items-center gap-1 sm:gap-2">
					{/* Left Arrow Button */}
					<motion.button
						onClick={scrollLeft}
						disabled={!canScrollLeft}
						className={`
              p-1.5 sm:p-2 rounded-full border text-xs sm:text-sm
              ${canScrollLeft
								? 'border-gray-300 bg-white text-gray-600'
								: 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
							}
            `}
						whileHover={canScrollLeft ? {
							scale: 1.1,
							backgroundColor: "#f9fafb"
						} : {}}
						whileTap={canScrollLeft ? { scale: 0.9 } : {}}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 25
						}}
					>
						<FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
					</motion.button>

					{/* Right Arrow Button */}
					<motion.button
						onClick={scrollRight}
						disabled={!canScrollRight}
						className={`
              p-1.5 sm:p-2 rounded-full border text-xs sm:text-sm
              ${canScrollRight
								? 'border-gray-300 bg-white text-gray-600'
								: 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
							}
            `}
						whileHover={canScrollRight ? {
							scale: 1.1,
							backgroundColor: "#f9fafb"
						} : {}}
						whileTap={canScrollRight ? { scale: 0.9 } : {}}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 25
						}}
					>
						<FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
					</motion.button>
				</div>
			</div>

			{/* Horizontal Scrollable Container */}
			<div className="relative">
				<motion.div
					ref={scrollContainerRef}
					className="
            flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hidden
            px-3 sm:px-4 py-2
            snap-x snap-mandatory
          "
					onScroll={checkScrollButtons}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					{categories.map((category, index) => (
						<motion.div
							key={category.id}
							className="flex-shrink-0 snap-start"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								ease: "easeOut",
								type: "spring",
								stiffness: 100
							}}
						>
							<Card
								icon={category.icon}
								title={category.title}
								description={category.description}
								onClick={() => onCardClick?.(category.title)}
							/>
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
};
