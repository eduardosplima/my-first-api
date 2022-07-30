import { Injectable } from '@nestjs/common';

import { CreateTodoResponseDto } from './dto/create-todo-response.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { TodosRepository } from './repositories/todos.repository';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  async getTodos(): Promise<TodoDto[]> {
    return this.todosRepository.getTodos();
  }

  async getTodo(id: number): Promise<TodoDto> {
    return this.todosRepository.getTodo(id);
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
  ): Promise<CreateTodoResponseDto> {
    const id = await this.todosRepository.createTodo(createTodoDto);
    return { id };
  }

  async updateTodo(id: number, createTodoDto: CreateTodoDto): Promise<void> {
    // TODO: Tratar id não encontrado
    return this.todosRepository.updateTodo(id, createTodoDto);
  }

  async deleteTodo(id: number): Promise<void> {
    // TODO: Tratar id não encontrado
    return this.todosRepository.deleteTodo(id);
  }
}
