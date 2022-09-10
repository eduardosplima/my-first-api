import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentsModule } from '../attachments/attachments.module';
import { Todo } from './entities/todo.entity';
import { TodosRepository } from './repositories/todos.repository';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [AttachmentsModule, TypeOrmModule.forFeature([Todo])],
  providers: [TodosService, TodosRepository],
  controllers: [TodosController],
})
export class TodosModule {}
