import { Injectable } from '@nestjs/common';

import { AttachmentsService } from '../attachments/attachments.service';
import type { Attachment } from '../attachments/entities/attachment.entity';
import type { CreateTodoResponseDto } from './dto/create-todo-response.dto';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { GetTodosResultDto } from './dto/get-todos-result.dto';
import type { GetTodosDto } from './dto/get-todos.dto';
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

  async getTodos(
    getTodosDto: GetTodosDto,
    user: number,
  ): Promise<GetTodosResultDto> {
    const sort = getTodosDto.pageSort || 'createdAt';
    const order = getTodosDto.pageOrder || 'DESC';
    const skip = getTodosDto.pageStart * getTodosDto.pageSize;
    const take = getTodosDto.pageSize;

    const [content, totalRecords] =
      await this.todosRepository.findAndCountTodos(
        getTodosDto.title,
        getTodosDto.content,
        getTodosDto.startDate ? new Date(getTodosDto.startDate) : null,
        getTodosDto.endDate ? new Date(getTodosDto.endDate) : null,
        user,
        sort as keyof Todo,
        order,
        skip,
        take,
      );

    return {
      content: content as TodoDto[],
      totalRecords,
      totalPages: Math.ceil(totalRecords / getTodosDto.pageSize),
      currentPage: getTodosDto.pageStart,
      pageSize: getTodosDto.pageSize,
    };
  }

  async getTodo(id: number, user: number): Promise<TodoDto> {
    const todo = await this.todosRepository.getTodo(id);

    if (todo.user === user) {
      delete todo.user;
      return todo as TodoDto;
    }
    return null;
  }

  private async getAttachmentsByIdsOrFail(
    ids: number[],
  ): Promise<Attachment[]> {
    const attachments = await this.attachmentsService.getByIds(ids);

    ids.forEach((id) => {
      if (attachments.every((attachment) => attachment.id !== id)) {
        throw new AttachmentException(`Attachment '${id}' invalid`);
      }
    });

    return attachments;
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

    const attachments = await this.getAttachmentsByIdsOrFail(
      createTodoDto.attachments,
    );
    attachments.forEach((attachment) => {
      if (attachment.user === createTodoDto.user && !attachment.todo) {
        // eslint-disable-next-line no-param-reassign
        attachment.todo = todo;
        todo.attachments.push(attachment);
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

    const attachments = await this.getAttachmentsByIdsOrFail(
      createTodoDto.attachments,
    );
    attachments.forEach((attachment) => {
      if (
        attachment.user === createTodoDto.user &&
        (!attachment.todo || attachment.todo === todo.id)
      ) {
        // eslint-disable-next-line no-param-reassign
        attachment.todo = todo;
        todo.attachments.push(attachment);
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
