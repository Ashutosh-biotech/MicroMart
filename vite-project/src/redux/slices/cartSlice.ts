import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from '../../api/types/product.types';
import { cartService, type CartItem as ApiCartItem } from '../../api/services/cart.services';
import { type RootState } from '../store';
import { logout, logoutAsync } from './authSlice';

interface CartItem extends Product {
	quantity: number;
}

interface CartState {
	items: CartItem[];
	isOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
	try {
		const stored = localStorage.getItem('cart');
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
};

const saveCartToStorage = (items: CartItem[]) => {
	try {
		localStorage.setItem('cart', JSON.stringify(items));
	} catch {
		// Ignore storage errors
	}
};

const convertToApiCartItem = (item: CartItem): ApiCartItem => ({
	productId: item.id,
	productName: item.name,
	price: item.price.toString(),
	quantity: item.quantity,
	primaryImage: item.primaryImage
});

const convertFromApiCartItem = (item: ApiCartItem): CartItem => ({
	id: item.productId,
	name: item.productName,
	price: parseFloat(item.price),
	quantity: item.quantity,
	primaryImage: item.primaryImage || '',
	description: '',
	category: '',
	brand: '',
	stockQuantity: 0,
	sku: '',
	additionalImages: [],
	attributes: {},
	active: true,
	createdAt: '',
	updatedAt: ''
});

const initialState: CartState = {
	items: loadCartFromStorage(),
	isOpen: false
};

// Async thunks for cart operations
export const syncCartWithBackend = createAsyncThunk(
	'cart/syncWithBackend',
	async (_, { getState }) => {
		const state = getState() as RootState;
		const { items } = state.cart;
		
		const apiItems = items.map(convertToApiCartItem);
		const cart = await cartService.syncCart(apiItems);
		return cart.items.map(convertFromApiCartItem);
	}
);

export const mergeCartsOnLogin = createAsyncThunk(
	'cart/mergeOnLogin',
	async (_, { getState }) => {
		const state = getState() as RootState;
		const { items: localItems } = state.cart;
		
		// Get backend cart
		const backendCart = await cartService.getCart();
		const backendItems = backendCart.items.map(convertFromApiCartItem);
		
		// Merge carts: combine quantities for same products
		const mergedItems = [...backendItems];
		localItems.forEach(localItem => {
			const existing = mergedItems.find(item => item.id === localItem.id);
			if (existing) {
				existing.quantity += localItem.quantity;
			} else {
				mergedItems.push(localItem);
			}
		});
		
		// Sync merged cart to backend
		const apiItems = mergedItems.map(convertToApiCartItem);
		const cart = await cartService.syncCart(apiItems);
		return cart.items.map(convertFromApiCartItem);
	}
);

export const loadCartFromBackend = createAsyncThunk(
	'cart/loadFromBackend',
	async () => {
		const cart = await cartService.getCart();
		return cart.items.map(convertFromApiCartItem);
	}
);

export const addToCartAsync = createAsyncThunk(
	'cart/addAsync',
	async (product: Product, { rejectWithValue }) => {
		try {
			const apiItem = convertToApiCartItem({ ...product, quantity: 1 });
			await cartService.addToCart(apiItem);
			
			// Always fetch cart after adding since add API doesn't return cart data
			const cart = await cartService.getCart();
			return cart.items ? cart.items.map(convertFromApiCartItem) : [];
		} catch (error: any) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const updateCartAsync = createAsyncThunk(
	'cart/updateAsync',
	async ({ id, quantity }: { id: string; quantity: number }) => {
		if (quantity <= 0) {
			await cartService.removeFromCart(id);
		} else {
			await cartService.updateCartItem(id, quantity);
		}
		
		const cart = await cartService.getCart();
		return cart.items.map(convertFromApiCartItem);
	}
);

export const clearCartAsync = createAsyncThunk(
	'cart/clearAsync',
	async () => {
		await cartService.clearCart();
		return [];
	}
);

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<Product>) => {
			const product = action.payload;
			const existing = state.items.find(item => item.id === product.id);
			
			if (existing) {
				existing.quantity += 1;
			} else {
				state.items.push({ ...product, quantity: 1 });
			}
			saveCartToStorage(state.items);
		},
		setCartItems: (state, action: PayloadAction<CartItem[]>) => {
			state.items = action.payload;
			saveCartToStorage(state.items);
		},
		removeFromCart: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(item => item.id !== action.payload);
			saveCartToStorage(state.items);
		},
		updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
			const { id, quantity } = action.payload;
			if (quantity <= 0) {
				state.items = state.items.filter(item => item.id !== id);
			} else {
				const item = state.items.find(item => item.id === id);
				if (item) {
					item.quantity = quantity;
				}
			}
			saveCartToStorage(state.items);
		},
		clearCart: (state) => {
			state.items = [];
			saveCartToStorage(state.items);
		},
		toggleCart: (state) => {
			state.isOpen = !state.isOpen;
		},
		closeCart: (state) => {
			state.isOpen = false;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(syncCartWithBackend.fulfilled, (state, action) => {
				state.items = action.payload;
				saveCartToStorage(state.items);
			})
			.addCase(mergeCartsOnLogin.fulfilled, (state, action) => {
				state.items = action.payload;
				saveCartToStorage(state.items);
			})
			.addCase(loadCartFromBackend.fulfilled, (state, action) => {
				state.items = action.payload;
				saveCartToStorage(state.items);
			})
			.addCase(addToCartAsync.fulfilled, (state, action) => {
				state.items = action.payload;
				saveCartToStorage(state.items);
			})
			.addCase(updateCartAsync.fulfilled, (state, action) => {
				state.items = action.payload;
				saveCartToStorage(state.items);
			})
			.addCase(clearCartAsync.fulfilled, (state, action) => {
				state.items = action.payload;
				saveCartToStorage(state.items);
			})
			.addCase(addToCartAsync.rejected, (state, action) => {
				// Fall back to local cart on API failure
				const product = action.meta.arg;
				const existing = state.items.find(item => item.id === product.id);
				if (existing) {
					existing.quantity += 1;
				} else {
					state.items.push({ ...product, quantity: 1 });
				}
				saveCartToStorage(state.items);
			})
			.addCase(logout, (state) => {
				state.items = [];
				saveCartToStorage(state.items);
			})
			.addCase(logoutAsync.fulfilled, (state) => {
				state.items = [];
				saveCartToStorage(state.items);
			});
	}
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, closeCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;