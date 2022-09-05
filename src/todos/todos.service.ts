import { Injectable } from '@nestjs/common';

import type { CreateTodoResponseDto } from './dto/create-todo-response.dto';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { TodoDto } from './dto/todo.dto';
import { TodosRepository } from './repositories/todos.repository';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  async getTodos(user: number): Promise<TodoDto[]> {
    return this.todosRepository.getTodos(user);
  }

  async getTodo(id: number, user: number): Promise<TodoDto> {
    const todo = await this.todosRepository.getTodo(id);

    if (todo.user === user) {
      delete todo.user;
      return todo;
    }
    return null;
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
  ): Promise<CreateTodoResponseDto> {
    const id = await this.todosRepository.createTodo(createTodoDto);
    return { id };
  }

  async updateTodo(
    todoDto: TodoDto,
    createTodoDto: CreateTodoDto,
  ): Promise<void> {
    return this.todosRepository.updateTodo(todoDto, createTodoDto);
  }

  async deleteTodo(todoDto: TodoDto): Promise<void> {
    return this.todosRepository.deleteTodo(todoDto.id);
  }
}
