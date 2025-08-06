import { Carousel } from "../components/home/Carousel";
import { useState, useEffect } from "react";
import { type CarouselItem } from "../components/home/Carousel";
import { banner_image_1, banner_image_2, banner_image_3, banner_image_6} from "../assets/assets";
import { GiClothes, GiBookshelf, GiConverseShoe, GiFoodTruck } from "react-icons/gi";
import { IoLogoElectron } from "react-icons/io5";
import { MdOutlinePets, MdChair, MdWatch } from "react-icons/md";
import { ShowCategories } from "../components/home/ShowCategories";
import { usePageTitle } from "../redux/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../components/product/ProductCard";
import { productService } from "../api/services/product.services";
import { type Product } from "../api/types/product.types";
import { viewedProductsUtil } from "../utils/viewedProducts";
import URLS from "../utils/URLS";

export const Home = () => {
	usePageTitle('Home');
	const [newProducts, setNewProducts] = useState<Product[]>([]);
	const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
	const [randomCategories, setRandomCategories] = useState<{category: string, products: Product[]}[]>([]);
	const [loading, setLoading] = useState(true);
	
	// Define carousel data
	const carouselData: CarouselItem[] = [
		{
			id: 1,
			category: "HOT PRODUCTS",
			title: "Fill your house with comfort",
			price: "₹1,799",
			image: banner_image_1,
			backgroundColor: "from-gray-100 to-blue-200"
		},
		{
			id: 2,
			category: "TRENDING NOW",
			title: "Premium Clothes Experience",
			price: "₹300",
			image: banner_image_2,
			backgroundColor: "from-indigo-400 to-purple-600"
		},
		{
			id: 3,
			category: "BEST SELLER",
			title: "World of Knowledge",
			price: "₹199",
			image: banner_image_3,
			backgroundColor: "from-pink-400 to-red-500"
		},
		{
			id: 4,
			category: "NEW ARRIVAL",
			title: "Taste of Hunger",
			price: "₹60",
			image: banner_image_6,
			backgroundColor: "from-green-400 to-blue-500"
		}
	];

	const categoriesData = [
		{
			id: '1',
			icon: <GiClothes />,
			title: 'Clothes & Fashion',
			description: 'Apparel & accessories'
		},
		{
			id: '2',
			icon: <IoLogoElectron />,
			title: 'Electronics',
			description: 'Gadgets & devices'
		},
		{
			id: '3',
			icon: <GiBookshelf />,
			title: 'Books',
			description: 'Literature & more'
		},
		{
			id: '4',
			icon: <MdOutlinePets />,
			title: 'Pets',
			description: 'Pet supplies & care'
		},
		{
			id: '5',
			icon: <MdChair />,
			title: 'Furniture',
			description: 'Home & office furniture'
		},
		{
			id: '6',
			icon: <GiConverseShoe />,
			title: 'Shoes',
			description: 'Footwear & sneakers'
		},
		{
			id: '7',
			icon: <GiFoodTruck />,
			title: 'Packaged Food',
			description: 'Snacks & beverages'
		},
		{
			id: '8',
			icon: <MdWatch />,
			title: 'Accessories',
			description: 'Watches & jewelry'
		}
	];

	const handleSlideChange = (_index: number) => {
		// Handle slide change if needed
	};

	const navigate = useNavigate();

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await productService.getAllProducts(0, 50);
				setNewProducts(response.content.slice(0, 8));
				
				// Get viewed products
				const viewedIds = viewedProductsUtil.getViewedProducts();
				if (viewedIds.length > 0) {
					const viewed = viewedIds
						.map(id => response.content.find((product: Product): boolean => product.id === id))
						.filter((product): product is Product => product !== undefined);
					setViewedProducts(viewed.slice(0, 4));
				}
				
				// Get random categories
				const categories = [...new Set(response.content.map((p: Product): string => p.category))];
				const shuffled = categories.sort(() => 0.5 - Math.random());
				const selected = shuffled.slice(0, 2);
				
				const categoryData = selected.map((category) => ({
					category: category as string,
					products: response.content.filter((p: Product): boolean => p.category === category).slice(0, 4)
				}));
				
				setRandomCategories(categoryData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		
		loadData();
	}, []);

	const handleCardClick = (category: string) => {
		navigate(`${URLS.PRODUCTS}?category=${encodeURIComponent(category)}`);
	};

	return (
		<div>
			<section className="w-full md:p-4">
				<Carousel
					items={carouselData}
					height="h-[600px]" // Custom height
					className="mx-auto rounded-none md:rounded-2xl" // Optional container constraint
					onSlideChange={handleSlideChange}
				/>
			</section>
			<div className="min-h-screen bg-gray-50 py-4 sm:py-8">
				<ShowCategories
					categories={categoriesData}
					title="Shop by Category"
					className="max-w-7xl mx-auto"
					onCardClick={handleCardClick}
				/>
				
				{/* Recently Viewed Section */}
				{viewedProducts.length > 0 && (
					<div className="max-w-7xl mx-auto px-4 py-8">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
						</div>
						
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{viewedProducts.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</div>
				)}
				
				{/* New Products Section */}
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-900">New Products</h2>
						<button
							onClick={() => navigate(URLS.PRODUCTS)}
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							View All &gt;&gt;
						</button>
					</div>
					
					{loading ? (
						<div className="text-center py-8">Loading products...</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{newProducts.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
				
				{/* Random Categories Sections */}
				{randomCategories.map(({category, products}) => (
					<div key={category} className="max-w-7xl mx-auto px-4 py-8">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">{category}</h2>
							<button
								onClick={() => handleCardClick(category)}
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								View All &gt;&gt;
							</button>
						</div>
						
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{products.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}