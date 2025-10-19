import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(body: any): Promise<{
        email: string;
        roles: string[];
    }>;
    signIn(body: any): Promise<import("@nestjs/common").UnauthorizedException | {
        accessToken: string;
    }>;
}
