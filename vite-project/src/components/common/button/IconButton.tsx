import React from "react";
import { Badge } from "./badge/Badge";

interface IconButtonProps {
  icon: React.ReactNode;
  badge?: number;
  ariaLabel: string;
  onClick?: () => void;
  size?: "sm" | "md";
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  badge,
  ariaLabel,
  onClick,
  size = "md"
}) => {
  const sizeClasses = size === "sm" ? "p-2 text-lg" : "p-2.5 text-xl";

  return (
    <button
      onClick={onClick}
      className={`relative ${sizeClasses} text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 cursor-pointer`}
      aria-label={ariaLabel}
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <Badge count={badge} />
      )}
    </button>
  );
};

// Make sure to export the component
export { IconButton };

