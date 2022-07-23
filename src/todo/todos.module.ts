import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Todo } from './entities/todo.entity';
import { TodosRepository } from './repositories/todos.repository';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodosService, TodosRepository],
  controllers: [TodosController],
})
export class TodosModule {}
