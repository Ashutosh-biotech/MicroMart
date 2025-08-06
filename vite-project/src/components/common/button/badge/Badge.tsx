interface BadgeProps {
  count: number;
  max?: number;
}

const Badge: React.FC<BadgeProps> = ({ count, max = 99 }) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
      {displayCount}
    </span>
  );
};

export { Badge };
