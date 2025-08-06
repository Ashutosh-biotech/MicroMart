import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DropdownProps {
	trigger: ReactNode;
	children: ReactNode;
	align?: "left" | "right";
	className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
	trigger,
	children,
	align = "right",
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<div
				onClick={toggleDropdown}
				className="cursor-pointer"
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						toggleDropdown();
					}
				}}
				aria-expanded={isOpen}
				aria-haspopup="menu"
			>
				{trigger}
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className={`absolute top-full mt-2 min-w-[12rem] bg-white shadow-lg rounded-lg border border-gray-200 z-50 ${align === "right" ? "right-0" : "left-0"
							}`}
						role="menu"
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
