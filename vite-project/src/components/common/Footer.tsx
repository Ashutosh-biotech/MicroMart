import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { logo_brand } from '../../assets/assets';
import URLS from '../../utils/URLS';

export const Footer: React.FC = () => {
	return (
		<footer className="bg-teal-600 text-white">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="col-span-1 md:col-span-2">
						<img src={logo_brand} alt="MicroMart" className="h-10 mb-4" />
						<p className="text-teal-100 mb-4">
							Your one-stop destination for quality products at great prices. 
							Shop with confidence and enjoy fast, reliable delivery.
						</p>
						<div className="flex space-x-4">
							<a href="#" className="text-teal-200 hover:text-white transition-colors">
								<FaFacebook size={20} />
							</a>
							<a href="#" className="text-teal-200 hover:text-white transition-colors">
								<FaTwitter size={20} />
							</a>
							<a href="#" className="text-teal-200 hover:text-white transition-colors">
								<FaInstagram size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li><Link to={URLS.HOME} className="text-teal-100 hover:text-white">Home</Link></li>
							<li><Link to={URLS.PRODUCTS} className="text-teal-100 hover:text-white">Products</Link></li>
							<li><Link to={URLS.ORDERS} className="text-teal-100 hover:text-white">Orders</Link></li>
							<li><Link to={URLS.PROFILE} className="text-teal-100 hover:text-white">Profile</Link></li>
						</ul>
					</div>

					{/* Customer Service */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Support</h3>
						<ul className="space-y-2">
							<li><a href="#" className="text-teal-100 hover:text-white">Help Center</a></li>
							<li><a href="#" className="text-teal-100 hover:text-white">Contact Us</a></li>
							<li><a href="#" className="text-teal-100 hover:text-white">Returns</a></li>
							<li><a href="#" className="text-teal-100 hover:text-white">Shipping Info</a></li>
						</ul>
					</div>
				</div>

				<div className="border-t border-teal-500 mt-8 pt-8 text-center">
					<p className="text-teal-100">
						© 2025 MicroMart. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};