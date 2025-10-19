import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    signUp(email: string, password: string, roles?: string[]): Promise<{
        email: string;
        roles: string[];
    }>;
    signIn(email: string, password: string): Promise<UnauthorizedException | {
        accessToken: string;
    }>;
}
