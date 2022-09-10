import { Injectable } from '@nestjs/common';

import { AttachmentsService } from '../attachments/attachments.service';
import type { CreateTodoResponseDto } from './dto/create-todo-response.dto';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { TodoDto } from './dto/todo.dto';
import { Todo } from './entities/todo.entity';
import { AttachmentException } from './exceptions/attachment.exception';
import { TodosRepository } from './repositories/todos.repository';

@Injectable()
export class TodosService {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly todosRepository: TodosRepository,
  ) {}

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
    const todo = new Todo();
    todo.title = createTodoDto.title;
    todo.content = createTodoDto.content;
    todo.createdAt = new Date();
    todo.user = createTodoDto.user;
    todo.attachments = [];

    const attachments = await this.attachmentsService.getByIds(
      createTodoDto.attachments,
    );
    attachments.forEach((attachment) => {
      if (attachment.user === createTodoDto.user && !attachment.todo) {
        todo.attachments.push(attachment);
      } else {
        throw new AttachmentException(`Attachment '${attachment.id}' invalid`);
      }
    });

    const id = await this.todosRepository.createTodo(todo);
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
