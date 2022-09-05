import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTodoDto } from '../dto/create-todo.dto';
import { TodoDto } from '../dto/todo.dto';
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

  async createTodo(createTodoDto: CreateTodoDto): Promise<number> {
    const todo = new Todo();
    todo.title = createTodoDto.title;
    todo.content = createTodoDto.content;
    todo.user = createTodoDto.user;

    const result = await this.repository.insert(todo);

    return result.identifiers[0].id;
  }

  async updateTodo(
    todoDto: TodoDto,
    createTodoDto: CreateTodoDto,
  ): Promise<void> {
    const todo = this.repository.merge(todoDto as Todo, createTodoDto);

    await this.repository.save(todo);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
