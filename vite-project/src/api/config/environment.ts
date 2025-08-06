export interface Environment {
	API_BASE_URL: string;
	API_VERSION: string;
	ENVIRONMENT: 'development' | 'staging' | 'production';
}

const environments: Record<string, Environment> = {
	development: {
		API_BASE_URL: 'http://localhost:8080/api',
		API_VERSION: 'v1',
		ENVIRONMENT: 'development'
	},
	staging: {
		API_BASE_URL: 'https://staging-api.yourapp.com/api',
		API_VERSION: 'v1',
		ENVIRONMENT: 'staging'
	},
	production: {
		API_BASE_URL: 'https://api.yourapp.com/api',
		API_VERSION: 'v1',
		ENVIRONMENT: 'production'
	}
};

export const currentEnvironment: Environment = environments[import.meta.env.VITE_APP_ENV || 'development'];
