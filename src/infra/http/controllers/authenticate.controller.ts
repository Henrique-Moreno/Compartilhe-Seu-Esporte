import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipes';
import { compare } from 'bcryptjs';

const authenticateBodyShema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodyShema = z.infer<typeof authenticateBodyShema>

@Controller('/sessions')
export class AuthenticaController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodyShema))
  async handle(@Body() body: AuthenticateBodyShema) {

    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (!user) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
    }
  }
}