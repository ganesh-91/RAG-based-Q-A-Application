import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  controllers: [IngestionController],
  providers: [IngestionService, RabbitMQService],
})
export class IngestionModule {}
