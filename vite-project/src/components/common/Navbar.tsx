import { useState } from "react";
import { logo_brand } from "../../assets/assets";
import {
  LuShoppingCart,
  LuHeart,
  LuCircleUserRound,
  LuBell,
  LuMenu,
  LuX,
  LuLogOut
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { SearchBox } from "./navbar/SearchBox";
import { Dropdown } from "./Dropdown";
import URLS from "../../utils/URLS";
import { IconButton } from "./button/IconButton";
import { useAuth } from "../../redux/hooks/useAuth";
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import { toggleCart } from '../../redux/slices/cartSlice';

interface NavbarProps {
  categories: string[];
  cartCount?: number;
  notificationCount?: number;
  onSearch?: (query: string, category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  notificationCount = 0,
  onSearch
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const userDropdown = [
    { label: "Profile", path: URLS.PROFILE },
    { label: "Orders", path: URLS.ORDERS },
    {
      label: "Logout",
      path: "#",
      icon: <LuLogOut />,
      onClick: logout
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const AuthButton = () => {
    if (isAuthenticated) {
      return (
        <Dropdown
          trigger={
            <IconButton
              icon={<LuCircleUserRound />}
              ariaLabel="User menu"
            />
          }
          align="right"
        >
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              {user?.fullName || user?.email}
            </div>
            {userDropdown.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600 transition-colors"
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  closeMobileMenu();
                }}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        </Dropdown>
      );
    }

    return (
      <Link
        to={URLS.SIGNIN}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Sign In
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to={URLS.HOME} className="block">
            <img
              src={logo_brand}
              alt="Brand Logo"
              className="h-10 lg:h-12 w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-6">
          <SearchBox categories={categories} onSearch={onSearch} />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleCart())}
            className="flex items-center space-x-1 p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <LuShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="text-sm font-medium">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </button>
          {isAuthenticated && (
            <Link to={URLS.FAVORITES}>
              <IconButton
                icon={<LuHeart />}
                ariaLabel="Favorites"
              />
            </Link>
          )}
          <AuthButton />
          <IconButton
            icon={<LuBell />}
            badge={notificationCount}
            ariaLabel="Notifications"
            onClick={() => console.log('Notifications clicked')}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to={URLS.HOME} className="flex-shrink-0">
            <img
              src={logo_brand}
              alt="Brand Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Mobile Icons */}
          <div className="flex items-center gap-3">
            <Link
              to={URLS.CART}
              className="flex items-center space-x-1 p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <LuShoppingCart className="text-lg" />
              {totalItems > 0 && (
                <span className="text-xs font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <IconButton
              icon={<LuBell />}
              badge={notificationCount}
              ariaLabel="Notifications"
              size="sm"
            />
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-3">
          <SearchBox categories={categories} onSearch={onSearch} mobile />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              {isAuthenticated && (
                <Link
                  to={URLS.FAVORITES}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  <LuHeart className="text-lg" />
                  <span>Favorites</span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500 border-b">
                    {user?.fullName || user?.email}
                  </div>
                  {userDropdown.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                        closeMobileMenu();
                      }}
                    >
                      {item.icon && <span className="text-lg">{item.icon}</span>}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  to={URLS.SIGNIN}
                  className="flex items-center gap-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  <LuCircleUserRound className="text-lg" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
