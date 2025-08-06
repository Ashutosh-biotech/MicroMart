interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	token: string;
	refreshToken: string;
	fullName: string;
	email: string;
}


export type { LoginRequest, LoginResponse };