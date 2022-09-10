import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReqUser } from '../commom/decorators/req-user.decorator';
import { ErrorResponseDto } from '../commom/dto/error-response.dto';
import { User } from '../users/entities/user.entity';
import { CreateTodoResponseDto } from './dto/create-todo-response.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { AttachmentException } from './exceptions/attachment.exception';
import { TodosService } from './todos.service';

@ApiBearerAuth()
@ApiTags('todos')
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponseDto,
  })
  @Get()
  async getTodos(@ReqUser() user: User): Promise<TodoDto[]> {
    return this.todosService.getTodos(user.id);
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
    description: 'Todo not found',
  })
  @Get(':id')
  async getTodo(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: User,
  ): Promise<TodoDto> {
    const result = await this.todosService.getTodo(id, user.id);
    if (result) return result;

    throw new NotFoundException('Todo not found');
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponseDto,
  })
  @Post()
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @ReqUser() user: User,
  ): Promise<CreateTodoResponseDto> {
    let response: CreateTodoResponseDto;

    try {
      response = await this.todosService.createTodo({
        ...createTodoDto,
        user: user.id,
      });
    } catch (error) {
      if (error instanceof AttachmentException) {
        throw new ForbiddenException();
      }

      throw error;
    }

    return response;
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
    description: 'Todo not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTodoDto: CreateTodoDto,
    @ReqUser() user: User,
  ): Promise<void> {
    const todo = await this.todosService.getTodo(id, user.id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todosService.updateTodo(todo, {
      ...createTodoDto,
      user: user.id,
    });
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
    description: 'Todo not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: User,
  ): Promise<void> {
    const todo = await this.todosService.getTodo(id, user.id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todosService.deleteTodo(todo);
  }
}
