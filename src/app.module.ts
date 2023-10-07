import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infra/database/prisma/prisma.service';
import { CreateAccountController } from './infra/http/controllers/create-account.controller';
import { envSchema } from './infra/env/env';
import { AuthModule } from './infra/auth/auth.module';
import { AuthenticaController } from './infra/http/controllers/authenticate.controller';

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => envSchema.parse(env),
    isGlobal: true,
  }),
  AuthModule,
],
  controllers: [
    CreateAccountController,
    AuthenticaController,
  ],
  providers: [PrismaService],
})
export class AppModule {}