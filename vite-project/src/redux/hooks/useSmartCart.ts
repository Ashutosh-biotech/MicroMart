import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { type Product } from '../../api/types/product.types';
import { 
	addToCart, 
	removeFromCart, 
	updateQuantity, 
	clearCart,
	addToCartAsync,
	updateCartAsync,
	clearCartAsync
} from '../slices/cartSlice';

export const useSmartCart = () => {
	const dispatch = useDispatch();
	const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
	const cartState = useSelector((state: RootState) => state.cart);

	const smartAddToCart = async (product: Product) => {
		if (isAuthenticated && token) {
			try {
				await dispatch(addToCartAsync(product) as any).unwrap();
			} catch (error) {
				// Fallback to local storage if backend fails
				dispatch(addToCart(product));
			}
		} else {
			dispatch(addToCart(product));
		}
	};

	const smartUpdateQuantity = (id: string, quantity: number) => {
		if (isAuthenticated && token) {
			dispatch(updateCartAsync({ id, quantity }) as any);
		} else {
			dispatch(updateQuantity({ id, quantity }));
		}
	};

	const smartRemoveFromCart = (id: string) => {
		if (isAuthenticated && token) {
			dispatch(updateCartAsync({ id, quantity: 0 }) as any);
		} else {
			dispatch(removeFromCart(id));
		}
	};

	const smartClearCart = () => {
		if (isAuthenticated && token) {
			dispatch(clearCartAsync() as any);
		} else {
			dispatch(clearCart());
		}
	};

	return {
		...cartState,
		addToCart: smartAddToCart,
		updateQuantity: smartUpdateQuantity,
		removeFromCart: smartRemoveFromCart,
		clearCart: smartClearCart,
		isAuthenticated
	};
};