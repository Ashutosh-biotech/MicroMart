import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { mergeCartsOnLogin, loadCartFromBackend } from '../slices/cartSlice';

export const useCartSync = () => {
	const dispatch = useDispatch();
	const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
	const { items } = useSelector((state: RootState) => state.cart);
	const prevAuthState = useRef(isAuthenticated);

	useEffect(() => {
		// Only sync when user just logged in (auth state changed from false to true)
		if (isAuthenticated && !prevAuthState.current && user?.email) {
			if (items.length > 0) {
				// Merge localStorage cart with backend cart
				dispatch(mergeCartsOnLogin() as any);
			} else {
				// Load cart from backend if localStorage is empty
				dispatch(loadCartFromBackend() as any);
			}
		}
		prevAuthState.current = isAuthenticated;
	}, [isAuthenticated, user?.email, items.length, dispatch]);

	return {
		isAuthenticated,
		canSyncWithBackend: isAuthenticated && user?.email
	};
};