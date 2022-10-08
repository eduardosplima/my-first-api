import { PaginationQueryResponseDto } from '../../commom/dto/pagination-query-response.dto';
import { TodoDto } from './todo.dto';

export class GetTodosResultDto extends PaginationQueryResponseDto {
  content: TodoDto[];
}
