import { 
  Controller, 
  Post, 
  HttpCode, 
  Body, 
  ConflictException,
  UsePipes, 
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipes';

const createAccountBodyShema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodyShema = z.infer<typeof createAccountBodyShema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodyShema))
  async handle(@Body() body: CreateAccountBodyShema) { 
   const { name, email, password } = body;

   const userWithSameEmail = await this.prisma.user.findUnique({
    where: {
      email,
    }
   });

   if (userWithSameEmail) {
    throw new ConflictException('User with same e-mail address already exists.');
   }

   const hsthedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hsthedPassword,
      }
    });
  }
}