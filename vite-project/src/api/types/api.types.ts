export interface ApiEndpoint {
	readonly path: string;
	readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export interface ApiSection {
	readonly baseUrl: string;
	readonly endpoints: Record<string, ApiEndpoint>;
	buildUrl(endpoint: string): string;
	buildCustomUrl(path: string): string;
}

export interface ApiConfig {
	readonly baseUrl: string;
	readonly version: string;
	readonly sections: Record<string, ApiSection>;
}
