import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CarouselItem {
    id: number;
    category: string;
    title: string;
    price: string;
    image: string;
    backgroundColor: string;
}

interface CarouselProps {
    items: CarouselItem[];
    autoSlideInterval?: number;
    height?: string;
    className?: string;
    showArrows?: boolean;
    showDots?: boolean;
    enableAutoSlide?: boolean;
    onSlideChange?: (currentIndex: number) => void;
}

// Function to determine if background is dark and needs light text
const isDarkBackground = (bgClass: string): boolean => {
    const darkBgs = [
        'indigo-400', 'purple-600', 'pink-400', 'red-500',
        'green-400', 'blue-500', 'gray-800', 'black'
    ];
    return darkBgs.some(dark => bgClass.includes(dark));
};

export const Carousel: React.FC<CarouselProps> = ({
    items,
    autoSlideInterval = 5000,
    height = "h-[500px]",
    className = "",
    showArrows = true,
    showDots = true,
    enableAutoSlide = true,
    onSlideChange
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Function to start/restart the auto-slide timer
    const startAutoSlide = () => {
        if (!enableAutoSlide || items.length <= 1) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setDirection('forward');
            setCurrentSlide((prev) => (prev + 1) % items.length);
        }, autoSlideInterval);
    };

    useEffect(() => {
        startAutoSlide();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [items.length, autoSlideInterval, enableAutoSlide]);

    useEffect(() => {
        onSlideChange?.(currentSlide);
    }, [currentSlide, onSlideChange]);

    const goToSlide = (index: number) => {
        if (index === currentSlide) return;

        setDirection(index > currentSlide ? 'forward' : 'backward');
        setCurrentSlide(index);
        startAutoSlide();
    };

    const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % items.length;
        setDirection('forward');
        setCurrentSlide(nextIndex);
        startAutoSlide();
    };

    const prevSlide = () => {
        const prevIndex = (currentSlide - 1 + items.length) % items.length;
        setDirection('backward');
        setCurrentSlide(prevIndex);
        startAutoSlide();
    };

    if (!items || items.length === 0) {
        return (
            <div className={`w-full ${height} bg-gray-200 flex items-center justify-center ${className}`}>
                <p className="text-gray-500">No carousel items available</p>
            </div>
        );
    }

    // Determine if current background is dark
    const isCurrentBgDark = isDarkBackground(items[currentSlide].backgroundColor);

    // Check if using full screen (no border radius)
    const isFullScreen = className.includes('rounded-none');

    // Motion variants
    const slideVariants = {
        enter: (direction: 'forward' | 'backward') => ({
            opacity: 0,
            scale: 0.95,
            x: direction === 'forward' ? 100 : -100,
        }),
        center: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96] as const
            }
        },
        exit: (direction: 'forward' | 'backward') => ({
            opacity: 0,
            scale: 0.95,
            x: direction === 'forward' ? -100 : 100,
            transition: {
                duration: 0.4,
                ease: [0.55, 0.055, 0.675, 0.19] as const
            }
        })
    };

    const textVariants = {
        hidden: (direction: 'forward' | 'backward') => ({
            opacity: 0,
            y: 30,
            x: direction === 'forward' ? 50 : -50
        }),
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                delay: 0.2,
                ease: [0.43, 0.13, 0.23, 0.96] as const
            }
        }
    };

    const imageVariants = {
        hidden: (direction: 'forward' | 'backward') => ({
            opacity: 0,
            scale: 0.8,
            rotate: direction === 'forward' ? -10 : 10,
            x: direction === 'forward' ? 30 : -30
        }),
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            x: 0,
            transition: {
                duration: 0.8,
                delay: 0.4,
                ease: [0.43, 0.13, 0.23, 0.96] as const
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.1,
            y: -2,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    return (
        // Mobile responsive container with adaptive height
        <div className={`relative w-full ${height} sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group ${isFullScreen ? 'shadow-none' : 'rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl'
            } ${className}`}>
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={`absolute inset-0 bg-gradient-to-br ${items[currentSlide].backgroundColor} ${isFullScreen ? '' : 'rounded-2xl sm:rounded-3xl'
                        }`}
                >
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-6 md:py-0">
                        {/* Text Section - Full width on mobile, half on desktop */}
                        <motion.div
                            className="w-full md:flex-1 md:max-w-2xl z-10 text-center md:text-left mb-6 md:mb-0"
                            custom={direction}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.span
                                className="inline-block bg-white/20 backdrop-blur-md text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 sm:mb-6"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {items[currentSlide].category}
                            </motion.span>

                            <motion.h2
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-800 leading-tight mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0"
                                initial={{
                                    opacity: 0,
                                    x: direction === 'forward' ? 30 : -30
                                }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.3,
                                    ease: [0.43, 0.13, 0.23, 0.96] as const
                                }}
                            >
                                {items[currentSlide].title}
                            </motion.h2>

                            <div className="mb-4 sm:mb-6 md:mb-8">
                                <motion.span
                                    className={`block text-xs sm:text-sm mb-1 sm:mb-2 ${isCurrentBgDark ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Start from
                                </motion.span>
                                <motion.span
                                    className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold ${isCurrentBgDark
                                            ? 'text-yellow-300 drop-shadow-lg'
                                            : 'text-orange-600 drop-shadow-sm'
                                        }`}
                                    style={{
                                        textShadow: isCurrentBgDark
                                            ? '2px 2px 4px rgba(0,0,0,0.5)'
                                            : '1px 1px 2px rgba(255,255,255,0.8)'
                                    }}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                        rotate: direction === 'forward' ? -10 : 10
                                    }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                >
                                    {items[currentSlide].price}
                                </motion.span>
                            </div>
                        </motion.div>

                        {/* Image Section - Full width on mobile, half on desktop */}
                        <motion.div
                            className="w-full md:flex-1 flex justify-center items-center relative h-40 sm:h-48 md:h-auto"
                            custom={direction}
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.img
                                src={items[currentSlide].image}
                                alt={items[currentSlide].title}
                                className="max-w-full max-h-full md:max-h-[85%] object-contain drop-shadow-2xl"
                                whileHover={{
                                    scale: 1.05,
                                    rotate: direction === 'forward' ? 2 : -2,
                                    transition: { duration: 0.3 }
                                }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots - Better positioned for mobile */}
            {showDots && (
                <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
                    {items.map((_, index) => (
                        <motion.button
                            key={index}
                            className={`h-2 sm:h-3 rounded-full transition-all duration-300 shadow-lg border border-white/50 touch-manipulation ${index === currentSlide
                                    ? 'w-6 sm:w-8 bg-orange-500 border-white shadow-orange-300'
                                    : 'w-2 sm:w-3 bg-white/70 hover:bg-white shadow-white/20'
                                }`}
                            onClick={() => goToSlide(index)}
                            whileHover={{ scale: 1.3, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Desktop Navigation Arrows - Hidden on mobile, visible on hover */}
            {showArrows && items.length > 1 && (
                <>
                    <motion.button
                        className="hidden md:flex absolute left-4 lg:left-6 xl:left-8 top-1/2 transform -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-white/80 backdrop-blur-md rounded-full items-center justify-center text-gray-800 text-lg lg:text-xl xl:text-2xl hover:bg-white/90 shadow-lg
            opacity-0 pointer-events-none transition-all duration-300 ease-out 
            group-hover:opacity-100 group-hover:pointer-events-auto touch-manipulation"
                        onClick={prevSlide}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Previous slide"
                    >
                        <motion.svg
                            className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            whileHover={{ x: -2 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </motion.svg>
                    </motion.button>

                    <motion.button
                        className="hidden md:flex absolute right-4 lg:right-6 xl:right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-white/80 backdrop-blur-md rounded-full items-center justify-center text-gray-800 text-lg lg:text-xl xl:text-2xl hover:bg-white/90 shadow-lg
            opacity-0 pointer-events-none transition-all duration-300 ease-out 
            group-hover:opacity-100 group-hover:pointer-events-auto touch-manipulation"
                        onClick={nextSlide}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Next slide"
                    >
                        <motion.svg
                            className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            whileHover={{ x: 2 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                    </motion.button>
                </>
            )}

            {/* Mobile Navigation - Always visible on mobile */}
            <div className="md:hidden absolute top-1/2 transform -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none">
                <motion.button
                    className="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-lg pointer-events-auto touch-manipulation"
                    onClick={prevSlide}
                    whileTap={{ scale: 0.9, x: -2 }}
                    aria-label="Previous slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>
                <motion.button
                    className="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-lg pointer-events-auto touch-manipulation"
                    onClick={nextSlide}
                    whileTap={{ scale: 0.9, x: 2 }}
                    aria-label="Next slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export type { CarouselItem, CarouselProps };
export default Carousel;
