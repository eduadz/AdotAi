import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna a mensagem Hello World' })
  @ApiResponse({ status: 200, description: 'A mensagem foi retornada com sucesso.', type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
