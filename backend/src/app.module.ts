import { Module } from '@nestjs/common';
import { AllModules } from './shared/modules';
import { APP_GUARD } from '@nestjs/core';
import { configService } from './config/config.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally
      envFilePath: '.env', // Specify the .env file path
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    MailerModule.forRoot(configService.smtpEmailConfig()),
    ThrottlerModule.forRoot(configService.getThrottlerConfig()),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: async () => {
            const store = await redisStore({
              socket: {
                host: '127.0.0.1',
                port: 6379,
              },
              ttl: 360000,
            });
            return store;
          },

          isCacheableValue: (value: any) =>
            value !== undefined && value !== null,
          max: 100,
        };
      },
    }),
    ...AllModules,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
