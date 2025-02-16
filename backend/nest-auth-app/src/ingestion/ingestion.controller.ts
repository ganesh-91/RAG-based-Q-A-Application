import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
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
  ) { }

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  async getIngestionStatus() {
    return this.ingestionService.getIngestionStatus();
  }

  @Post('trigger')
  // @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async triggerIngestion(@Body() { filePath }: { filePath: string }) {
    // Send a message to Kafka instead of RabbitMQ
    // console.log('[filePath]', filePath)
    await this.ingestionService.triggerIngestion(filePath);
    // await this.kafkaService.triggerIngestion(filePath)
    return { message: 'Ingestion triggered successfully' };
  }
}