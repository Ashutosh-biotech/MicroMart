import { wishlistService } from '../api/services/wishlist.services';

const FAVORITES_KEY = 'micromart_favorites';

const isAuthenticated = () => !!localStorage.getItem('token');

export const favoritesUtil = {
	getFavorites: (): string[] => {
		const favorites = localStorage.getItem(FAVORITES_KEY);
		return favorites ? JSON.parse(favorites) : [];
	},

	initializeFavorites: async (): Promise<void> => {
		if (isAuthenticated()) {
			await favoritesUtil.loadWishlistFromBackend();
		}
	},

	addToFavorites: async (productId: string): Promise<void> => {
		if (isAuthenticated()) {
			try {
				await wishlistService.addToWishlist(productId);
			} catch (error) {
				console.error('Failed to add to wishlist:', error);
			}
		} else {
			const favorites = favoritesUtil.getFavorites();
			if (!favorites.includes(productId)) {
				favorites.push(productId);
				localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
			}
		}
	},

	removeFromFavorites: async (productId: string): Promise<void> => {
		if (isAuthenticated()) {
			try {
				await wishlistService.removeFromWishlist(productId);
			} catch (error) {
				console.error('Failed to remove from wishlist:', error);
			}
		} else {
			const favorites = favoritesUtil.getFavorites();
			const updated = favorites.filter(id => id !== productId);
			localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
		}
	},

	isFavorite: (productId: string): boolean => {
		return favoritesUtil.getFavorites().includes(productId);
	},

	toggleFavorite: async (productId: string): Promise<boolean> => {
		if (favoritesUtil.isFavorite(productId)) {
			await favoritesUtil.removeFromFavorites(productId);
			return false;
		} else {
			await favoritesUtil.addToFavorites(productId);
			return true;
		}
	},

	loadWishlistFromBackend: async (): Promise<void> => {
		if (isAuthenticated()) {
			try {
				const wishlist = await wishlistService.getWishlist();
				localStorage.setItem(FAVORITES_KEY, JSON.stringify(wishlist));
			} catch (error) {
				console.error('Failed to load wishlist:', error);
			}
		}
	}
};