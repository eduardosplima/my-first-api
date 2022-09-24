import { Injectable } from '@nestjs/common';

import { AttachmentsService } from '../attachments/attachments.service';
import { Attachment } from '../attachments/entities/attachment.entity';
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
    const results = await this.todosRepository.getTodos(user);
    return results as TodoDto[];
  }

  async getTodo(id: number, user: number): Promise<TodoDto> {
    const todo = await this.todosRepository.getTodo(id);

    if (todo.user === user) {
      delete todo.user;
      return todo as TodoDto;
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
        // eslint-disable-next-line no-param-reassign
        attachment.todo = todo;
        todo.attachments.push(attachment as Attachment & number);
      } else {
        throw new AttachmentException(`Attachment '${attachment.id}' invalid`);
      }
    });

    const id = await this.todosRepository.saveTodo(todo);
    return { id };
  }

  async updateTodo(
    todoDto: TodoDto,
    createTodoDto: CreateTodoDto,
  ): Promise<void> {
    const todo = new Todo();
    todo.id = todoDto.id;
    todo.title = createTodoDto.title;
    todo.content = createTodoDto.content;
    todo.createdAt = todoDto.createdAt;
    todo.user = createTodoDto.user;
    todo.attachments = [];

    const attachments = await this.attachmentsService.getByIds(
      createTodoDto.attachments,
    );
    attachments.forEach((attachment) => {
      if (attachment.user === createTodoDto.user && (!attachment.todo || attachment.todo === todo.id)) {
        // eslint-disable-next-line no-param-reassign
        attachment.todo = todo;
        todo.attachments.push(attachment as Attachment & number);
      } else {
        throw new AttachmentException(`Attachment '${attachment.id}' invalid`);
      }
    });

    await this.todosRepository.saveTodo(todo);
  }

  async deleteTodo(todoDto: TodoDto): Promise<void> {
    return this.todosRepository.deleteTodo(todoDto.id);
  }
}
