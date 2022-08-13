import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
    }),
    CoreModule.forRoot(),

    AuthModule,
    TodosModule,
    UsersModule,
  ],
})
export class AppModule {}
