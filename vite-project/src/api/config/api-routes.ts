import { currentEnvironment } from './environment.ts';

export const ApiModules = {
	AUTH: 'auth',
	USER: 'user',
	PRODUCTS: 'products',
	ORDERS: 'orders',
	CART: 'cart'
} as const;
export type ApiModules = typeof ApiModules[keyof typeof ApiModules];

export const AuthEndpoints = {
	LOGIN: 'login',
	REGISTER: 'register',
	VALIDATE: 'validate',
	LOGOUT: 'logout',
	REFRESH_TOKEN: 'refresh'
} as const;
export type AuthEndpoints = typeof AuthEndpoints[keyof typeof AuthEndpoints];

export const UserEndpoints = {
	PROFILE: 'profile',
	ORDERS: 'orders',
	SETTINGS: 'settings',
	AVATAR: 'avatar'
} as const;
export type UserEndpoints = typeof UserEndpoints[keyof typeof UserEndpoints];

export const ProductEndpoints = {
	LIST: '',
	SEARCH: 'search',
	CATEGORIES: 'categories'
} as const;
export type ProductEndpoints = typeof ProductEndpoints[keyof typeof ProductEndpoints];

export const CartEndpoints = {
	GET: '',
	ADD: 'items',
	UPDATE: 'items',
	REMOVE: 'items',
	CLEAR: '',
	SYNC: 'sync'
} as const;
export type CartEndpoints = typeof CartEndpoints[keyof typeof CartEndpoints];

interface RouteConfig {
	module: ApiModules;
	endpoint?: string;
	id?: string;
}

class ApiRouteBuilder {

	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private buildPath(config: RouteConfig): string {
		const { module, endpoint, id } = config;
		let path = `${this.baseUrl}/${module}`;

		if (endpoint) {
			path += `/${endpoint}`;
		}

		if (id) {
			path += `/${id}`;
		}

		return path;
	}

	auth(endpoint: AuthEndpoints): string {
		return this.buildPath({ module: ApiModules.AUTH, endpoint });
	}

	user(endpoint: UserEndpoints): string {
		return this.buildPath({ module: ApiModules.USER, endpoint });
	}

	products(endpoint?: ProductEndpoints, id?: string): string {
		return this.buildPath({
			module: ApiModules.PRODUCTS,
			endpoint: endpoint || undefined,
			id
		});
	}

	cart(endpoint?: CartEndpoints | 'get', productId?: string): string {
		let path = `${this.baseUrl}/${ApiModules.CART}`;
		if (endpoint) {
			path += `/${endpoint}`;
		}
		if (productId) {
			path += `/${productId}`;
		}
		return path;
	}

	custom(module: ApiModules, endpoint?: string, id?: string): string {
		return this.buildPath({ module, endpoint, id });
	}

	getModuleBase(module: ApiModules): string {
		return `${this.baseUrl}/${module}`;
	}
}

// Export singleton instance using current environment
export const ApiRoutes = new ApiRouteBuilder(currentEnvironment.API_BASE_URL);

// Export the class for potential custom instances
export { ApiRouteBuilder };

// Export type-safe route collections
export const Routes = {
	Auth: {
		login: ApiRoutes.auth(AuthEndpoints.LOGIN),
		register: ApiRoutes.auth(AuthEndpoints.REGISTER),
		validate: ApiRoutes.auth(AuthEndpoints.VALIDATE),
		logout: ApiRoutes.auth(AuthEndpoints.LOGOUT),
		refreshToken: ApiRoutes.auth(AuthEndpoints.REFRESH_TOKEN),
	},

	User: {
		profile: ApiRoutes.user(UserEndpoints.PROFILE),
		orders: ApiRoutes.user(UserEndpoints.ORDERS),
		settings: ApiRoutes.user(UserEndpoints.SETTINGS),
		avatar: ApiRoutes.user(UserEndpoints.AVATAR),
	},

	Products: {
		list: ApiRoutes.products(),
		search: ApiRoutes.products(ProductEndpoints.SEARCH),
		categories: ApiRoutes.products(ProductEndpoints.CATEGORIES),
		byId: (id: string) => ApiRoutes.products(undefined, id),
	},

	Orders: {
		list: ApiRoutes.custom(ApiModules.ORDERS),
		byId: (id: string) => ApiRoutes.custom(ApiModules.ORDERS, undefined, id),
	},

	Cart: {
		get: () => ApiRoutes.cart('get'),
		add: () => ApiRoutes.cart(CartEndpoints.ADD),
		update: (productId: string) => ApiRoutes.cart(CartEndpoints.UPDATE, productId),
		remove: (productId: string) => ApiRoutes.cart(CartEndpoints.REMOVE, productId),
		clear: () => ApiRoutes.cart(CartEndpoints.CLEAR),
		sync: () => ApiRoutes.cart(CartEndpoints.SYNC),
	}
} as const;
