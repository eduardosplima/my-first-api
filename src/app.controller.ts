import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly helloWorld = 'Hello World!';

  @Get()
  getHelloWorld(): string {
    return this.helloWorld;
  }
}
