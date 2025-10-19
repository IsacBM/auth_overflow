"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
const users = [];
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async signUp(email, password, roles = []) {
        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            throw new common_1.BadRequestException('Esse email já está cadastrado!');
        }
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(password, salt, 32));
        const saltAndHash = `${salt}.${hash.toString('hex')}`;
        const user = {
            email,
            password: saltAndHash,
            roles,
        };
        users.push(user);
        console.log('Signed up', user);
        const { password: _, ...result } = user;
        return result;
    }
    async signIn(email, password) {
        const user = users.find((user) => user.email === email);
        if (!user) {
            return new common_1.UnauthorizedException('Credenciais invalidas :/');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32));
        if (storedHash != hash.toString('hex')) {
            return new common_1.UnauthorizedException('Credenciais invalidas :/');
        }
        console.log('Login feito como', user);
        const payload = {
            username: user.email,
            sub: user.userId,
            roles: user.roles,
        };
        return { accessToken: this.jwtService.sign(payload) };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map