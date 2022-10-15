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

  async findAndCountTodos(
    title: string,
    content: string,
    startDate: Date,
    endDate: Date,
    user: number,
    sort: keyof Todo,
    order: 'ASC' | 'DESC',
    skip: number,
    take: number,
  ): Promise<[Todo[], number]> {
    const query = this.repository
      .createQueryBuilder('todos')
      .where('todos.user = :user', { user });

    if (title) {
      query.andWhere('upper(todos.title) like upper(:title)', {
        title: `%${title}%`,
      });
    }

    if (content) {
      query.andWhere('upper(todos.content) like upper(:content)', {
        content: `%${content}%`,
      });
    }

    if (startDate && endDate) {
      query.andWhere('todos.createdAt between :startDate and :endDate', {
        startDate,
        endDate,
      });
    }

    if (sort && order) {
      query.orderBy(`todos.${sort}`, order);
    }

    query.skip(skip).take(take);
    return query.getManyAndCount();
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
