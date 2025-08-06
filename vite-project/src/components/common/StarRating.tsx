import React from 'react';

interface StarRatingProps {
	rating: number;
	maxRating?: number;
	size?: 'sm' | 'md' | 'lg';
	showCount?: boolean;
	reviewCount?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
	rating,
	maxRating = 5,
	size = 'md',
	showCount = false,
	reviewCount = 0
}) => {
	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg'
	};

	const renderStars = () => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < maxRating; i++) {
			if (i < fullStars) {
				stars.push(
					<span key={i} className="text-yellow-400">★</span>
				);
			} else if (i === fullStars && hasHalfStar) {
				stars.push(
					<span key={i} className="text-yellow-400">☆</span>
				);
			} else {
				stars.push(
					<span key={i} className="text-gray-300">★</span>
				);
			}
		}
		return stars;
	};

	return (
		<div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
			<div className="flex">
				{renderStars()}
			</div>
			<span className="text-gray-600 font-medium">
				{rating.toFixed(1)}
			</span>
			{showCount && reviewCount > 0 && (
				<span className="text-gray-500 text-sm">
					({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
				</span>
			)}
		</div>
	);
};