import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { VerifyEmail } from "./pages/VerifyEmail";
import { ProductPage } from "./pages/ProductPage";
import { ProductsPage } from "./pages/ProductsPage";
import { OrdersPage } from "./pages/OrdersPage";
import { CartPage } from "./pages/CartPage";
import { UserProfile } from "./pages/UserProfile";
import { FavoritesPage } from "./pages/FavoritesPage";
import { CartSidebar } from "./components/cart/CartSidebar";
import { useCartSync } from "./redux/hooks/useCartSync";
import { getCategoryTitles } from "./utils/categories";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import URLS from './utils/URLS';

function App() {
  // Initialize cart synchronization
  useCartSync();

  const categories = getCategoryTitles();

  return (
    <>
      <Navbar categories={categories} />
      <Routes>
        <Route path={URLS.HOME} element={<Home />} />
        <Route path={URLS.SIGNIN} element={<SignIn />} />
        <Route path={URLS.SIGNUP} element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path={URLS.PRODUCTS} element={<ProductsPage />} />
        <Route path={`${URLS.PRODUCT}/:id`} element={<ProductPage />} />
        <Route path={URLS.CART} element={<CartPage />} />
        <Route path={URLS.ORDERS} element={<OrdersPage />} />
        <Route path={URLS.PROFILE} element={<UserProfile />} />
        <Route path={URLS.FAVORITES} element={<FavoritesPage />} />
      </Routes>
      <Footer />
      <CartSidebar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App;
