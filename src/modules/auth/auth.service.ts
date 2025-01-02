import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new NotFoundException("User not found.")
        }

        const validatePassword = await compare(password, user.password)
        if (!validatePassword) {
            throw new UnauthorizedException("Wrong password.")
        }

        const payload = { sub: user.id, name: user.email }

        return {
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
