import { Controller, Post, Get, UseGuards, Body, Req } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { UserRole } from '../shared/constants';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { KafkaService } from 'src/utils/kafka';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly kafkaService: KafkaService, // Use KafkaService instead of RabbitMQService
  ) {}

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async getIngestionStatus(@Body() { id }: { id: number }) {
    console.log('[testss]');
    return this.ingestionService.getIngestionStatus(id);
  }

  @Post('trigger')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async triggerIngestion(@Body() { filePath }: { filePath: string }) {
    console.log('[test]');
    await this.ingestionService.triggerIngestion(filePath);
    return { message: 'Ingestion triggered successfully' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.ingestionService.findAll();
  }

  // @Post('update')
  // @Roles(UserRole.ADMIN, UserRole.EDITOR)
  // async triggerIngestionUpdate(@Body() { fileName }: { fileName: string }) {
  //   console.log('[test]');
  //   await this.ingestionService.triggerIngestionStatus(fileName);
  //   return { message: 'Ingestion triggered successfully' };
  // }
}
