import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('/signin')
    async signIn(@Body() signInDto: Record<string, any>) {
        return await this.authService.signIn(signInDto.email, signInDto.password)
    }
}