import {
  Body,
  Controller,
  Delete,
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
import { User } from '../users/entities/user.entity';
import { CreateTodoResponseDto } from './dto/create-todo-response.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { TodosService } from './todos.service';

@ApiBearerAuth()
@ApiTags('todos')
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos(@ReqUser() user: User): Promise<TodoDto[]> {
    return this.todosService.getTodos(user.id);
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
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
    description: 'Bad Request',
  })
  @Post()
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @ReqUser() user: User,
  ): Promise<CreateTodoResponseDto> {
    return this.todosService.createTodo({ ...createTodoDto, user: user.id });
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
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
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
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
