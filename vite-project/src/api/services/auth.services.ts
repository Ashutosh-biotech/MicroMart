import axios from 'axios';
import { Routes } from '../config/api-routes';
import type { LoginRequest, LoginResponse } from '../types/login.types';
import type { RegisterRequest } from '../types/register.types';

export class AuthService {
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await axios.post(Routes.Auth.login, credentials);
		return response.data;
	}

	async register(userData: RegisterRequest): Promise<void> {
		await axios.post(Routes.Auth.register, userData);
	}

	async validateToken(token: string): Promise<{ user: any }> {
		const response = await axios.post(Routes.Auth.validate, {}, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	}

	async refreshToken(refreshToken: string): Promise<LoginResponse> {
		const response = await axios.post(Routes.Auth.refreshToken, { refreshToken });
		return response.data;
	}

	async logout(token?: string | null, refreshToken?: string | null): Promise<void> {
		const payload: any = {};
		if (token) payload.token = token;
		if (refreshToken) payload.refreshToken = refreshToken;
		
		await axios.post(Routes.Auth.logout, payload);
	}

	async verifyEmail(token: string): Promise<any> {
		const response = await axios.post(`http://localhost:8080/api/auth/verify-email?token=${token}`);
		return response.data;
	}
}

export const authService = new AuthService();
