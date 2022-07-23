import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTodoDto } from '../../dto/create-todo.dto';
import { Todo } from '../entities/todo.entity';

@Injectable()
export class TodosRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
  ) {}

  async getTodos(): Promise<Todo[]> {
    return this.repository.find();
  }

  async getTodo(id: number): Promise<Todo> {
    return this.repository.findOne({ where: { id } });
  }

  async createTodo(createTodoDto: CreateTodoDto): Promise<number> {
    const todo = new Todo();
    todo.title = createTodoDto.title;
    todo.content = createTodoDto.content;

    const result = await this.repository.insert(todo);

    return result.identifiers[0].id;
  }

  async updateTodo(id: number, createTodoDto: CreateTodoDto): Promise<void> {
    const todo = new Todo();
    todo.title = createTodoDto.title;
    todo.content = createTodoDto.content;

    await this.repository.update({ id }, todo);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
