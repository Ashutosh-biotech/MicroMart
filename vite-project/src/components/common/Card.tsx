import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
	icon: React.ReactNode;
	title: string;
	description?: string;
	onClick?: () => void;
	className?: string;
}

export const Card: React.FC<CardProps> = ({
	icon,
	title,
	description,
	onClick,
	className = ''
}) => {
	return (
		<motion.div
			className={`
				flex flex-col items-center justify-center gap-5
				pt-6 pb-3 px-3 sm:pt-8 sm:pb-4 sm:px-4
				w-36 h-44 sm:w-40 sm:h-48 md:w-44 md:h-52 lg:w-48 lg:h-56
				border border-gray-200 rounded-lg 
				bg-white shadow-sm 
				cursor-pointer text-center
				${className}
			`}
			onClick={onClick}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
			whileHover={{
				scale: 1.05,
				boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
			}}
			whileTap={{ scale: 0.98 }}
			transition={{
				type: "spring",
				stiffness: 300,
				damping: 20,
				mass: 0.8
			}}
		>
			<motion.div
				className="flex-shrink-0 mb-2 sm:mb-4 text-2xl sm:text-3xl md:text-4xl text-blue-500"
				whileHover={{
					scale: 1.1,
					rotate: [0, -5, 5, 0]
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut"
				}}
			>
				{icon}
			</motion.div>

			<div className="flex flex-col gap-2">
				<h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 m-0 leading-tight">
					{title}
				</h3>
				{description && (
					<p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0 line-clamp-2">
						{description}
					</p>
				)}
			</div>
		</motion.div>
	);
};
