import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Todo } from '../entities/todo.entity';

@Injectable()
export class TodosRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
  ) {}

  async getTodos(user: number): Promise<Todo[]> {
    return this.repository
      .createQueryBuilder('todos')
      .where('todos.user = :user', { user })
      .getMany();
  }

  async getTodo(id: number): Promise<Todo> {
    return this.repository.findOne({ where: { id }, loadRelationIds: true });
  }

  async saveTodo(todo: Todo): Promise<number> {
    const result = await this.repository.save(todo);
    return result.id;
  }

  async deleteTodo(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
