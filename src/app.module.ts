import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CoreModule } from './core/core.module';
import { TodosModule } from './todo/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
    }),
    CoreModule.forRoot(),

    TodosModule,
  ],
})
export class AppModule {}
