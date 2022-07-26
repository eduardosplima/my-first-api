import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';

// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
    }),
    CoreModule.forRoot(),

    // AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
