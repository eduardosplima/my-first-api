import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AttachmentsModule } from './attachments/attachments.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { DomainsModule } from './domains/domains.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
    }),
    CoreModule.forRoot(),
    ScheduleModule.forRoot(),

    AttachmentsModule,
    AuthModule,
    DomainsModule,
    TodosModule,
    UsersModule,
  ],
})
export class AppModule {}
