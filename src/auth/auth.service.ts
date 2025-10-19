import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

const users = []; // bd improvisado

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // verifica se o usuário já está cadastrado
  async signUp(email: string, password: string, roles: string[] = []) {
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      throw new BadRequestException('Esse email já está cadastrado!');
    }

    const salt = randomBytes(8).toString('hex'); // gera o salt
    const hash = (await scrypt(password, salt, 32)) as Buffer; // cria o hash
    const saltAndHash = `${salt}.${hash.toString('hex')}`; // coloca o salt e o hash na msm string

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

  // pega os parametros e valida para gerar o token
  async signIn(email: string, password: string) {
    const user = users.find((user) => user.email === email); // Procura o usuário
    if (!user) {
      return new UnauthorizedException('Credenciais invalidas :/');
    }

    const [salt, storedHash] = user.password.split('.'); // pega o salt e o hash
    const hash = (await scrypt(password, salt, 32)) as Buffer; // refaz o hash

    if (storedHash != hash.toString('hex')) {
      return new UnauthorizedException('Credenciais invalidas :/');
    }

    console.log('Login feito como', user);
    const payload = {
      username: user.email,
      sub: user.userId,
      roles: user.roles,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
