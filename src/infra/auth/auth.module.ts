import { Module } from "@nestjs/common/decorators";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env/env";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {

        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true});
        const publicKey = config.get('DATABASE_URL', { infer: true});

        return {
          signOptions: { algorithm: 'RS256'},
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    })
  ]
})
export class AuthModule {}